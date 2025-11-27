const Post = require('../models/Post');

exports.getSitemap = async (req, res) => {
    try {
        // Fetch all posts (you might want to limit this if you have thousands)
        const posts = await Post.findAll({});

        const baseUrl = 'https://www.kirdarbarcelona.com';

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

        // Add static pages
        const staticPages = [
            { url: '/', priority: '1.0', changefreq: 'daily' },
            { url: '/login', priority: '0.5', changefreq: 'monthly' },
            { url: '/register', priority: '0.5', changefreq: 'monthly' },
        ];

        staticPages.forEach(page => {
            xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
        });

        // Add dynamic post pages
        posts.forEach(post => {
            const lastMod = post.updatedAt || post.createdAt || new Date().toISOString();
            xml += `
  <url>
    <loc>${baseUrl}/post/${post.slug || post.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).send('Error generating sitemap');
    }
};
