import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { Box, Typography, Skeleton, styled } from '@mui/material';

// Styled Components for Ceraso Font Aesthetic
const BlogTitle = styled(Typography)(({ theme }) => ({
    fontFamily: '"Ceraso", "Playfair Display", serif', // Fallback to Playfair if Ceraso isn't local
    fontSize: 'clamp(3rem, 10vw, 6rem)', // Responsive font size
    fontWeight: 900,
    textAlign: 'center',
    background: 'linear-gradient(135deg, #1f2937 0%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    marginBottom: '3rem',
    lineHeight: 1,
}));

const FeaturedCard = memo(({ post, className, style, showExcerpt = false, cardColor = 'white', hasPattern = false }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    if (!post) return null;

    const stripHtml = (html) => {
        return html ? html.replace(/<[^>]*>?/gm, '') : '';
    };

    return (
        <Box
            component={Link}
            to={`/post/${post.slug || post.id}`}
            state={{ post }} // Pass post data for instant load
            className={className}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: showExcerpt ? 'clamp(1.5rem, 5vw, 3rem)' : '2rem', // Responsive padding
                color: '#1f2937',
                textDecoration: 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                background: cardColor,
                border: '1px solid rgba(0,0,0,0.05)',
                minHeight: showExcerpt ? '500px' : '250px',
                ...style,
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }
            }}
        >
            {post.imageUrl && (
                <>
                    {!imageLoaded && (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            sx={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
                        />
                    )}
                    <Box
                        component="img"
                        src={post.imageUrl}
                        alt={post.title}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 0,
                            opacity: showExcerpt ? (imageLoaded ? 1 : 0) : (imageLoaded ? 0.3 : 0),
                            transition: 'opacity 0.3s ease'
                        }}
                    />
                </>
            )}

            {hasPattern && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    background: `linear-gradient(135deg, transparent 30%, rgba(0,0,0,${showExcerpt ? 0.7 : 0.1}) 100%)`,
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 40% 100%)'
                }} />
            )}

            {showExcerpt && (
                <Box sx={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 3 }}>
                    <Box sx={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TrendingUp size={24} color="white" />
                    </Box>
                </Box>
            )}

            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <Typography variant="caption" sx={{
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(4px)',
                        padding: '0.4rem 1rem',
                        borderRadius: '2rem',
                        color: '#374151',
                        letterSpacing: '0.5px'
                    }}>
                        Category . {post.category}
                    </Typography>
                    {!showExcerpt && (
                        <Box sx={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s'
                        }}>
                            <ArrowUpRight size={18} color="#374151" />
                        </Box>
                    )}
                </Box>

                <Typography variant="h3" sx={{
                    fontSize: showExcerpt ? 'clamp(1.8rem, 4vw, 3rem)' : '1.75rem', // Responsive font size
                    fontWeight: '900',
                    lineHeight: 1.1,
                    marginBottom: showExcerpt ? '1.5rem' : '0.75rem',
                    color: showExcerpt ? 'white' : '#1f2937',
                    textShadow: showExcerpt ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                    letterSpacing: '-0.02em',
                    fontFamily: '"Inter", sans-serif'
                }}>
                    {post.title}
                </Typography>

                {showExcerpt && (
                    <Typography variant="body1" sx={{
                        fontSize: '1.1rem',
                        opacity: 0.95,
                        color: 'white',
                        maxWidth: '80%',
                        marginBottom: '1.5rem',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {stripHtml(post.content)}
                    </Typography>
                )}

                <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.8, color: showExcerpt ? 'white' : '#6b7280', fontWeight: '500' }}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
            </Box>
        </Box>
    );
});

const ListItem = memo(({ post }) => {
    if (!post) return null;
    return (
        <Box
            component={Link}
            to={`/post/${post.slug || post.id}`}
            state={{ post }} // Pass post data for instant load
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                background: 'rgba(255,255,255,0.6)',
                borderRadius: '1rem',
                textDecoration: 'none',
                color: '#1f2937',
                marginBottom: '0.75rem',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
                '&:hover': {
                    background: 'rgba(255,255,255,0.9)',
                    transform: 'translateX(4px)'
                }
            }}
        >
            <Typography variant="body1" sx={{ fontWeight: '700', fontSize: '0.95rem', flex: 1, marginRight: '1rem' }}>
                {post.title}
            </Typography>
            <ArrowUpRight size={18} style={{ opacity: 0.5 }} />
        </Box>
    );
});

const BentoGrid = memo(({ data, loading = false }) => {
    if (loading) {
        return (
            <Box sx={{ marginBottom: '4rem' }}>
                <Skeleton variant="text" width={200} height={80} sx={{ margin: '0 auto 3rem auto' }} />
                <Box className="bento-grid" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' }, gap: '1.5rem' }}>
                    <Skeleton variant="rectangular" height={500} sx={{ borderRadius: '2rem' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: '2rem' }} />
                        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: '2rem' }} />
                        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: '2rem' }} />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (!data) return null;
    const { hero, topRight, middleList, bottomRight } = data;

    return (
        <Box sx={{ marginBottom: '4rem' }}>
            <BlogTitle variant="h1">
                KirdarBarcelona
            </BlogTitle>

            <Box className="bento-grid" sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
                gap: '1.5rem'
            }}>
                <Box sx={{ gridColumn: { xs: 'auto', lg: '1' }, minHeight: '500px', display: 'flex' }}>
                    {hero ? (
                        <FeaturedCard post={hero} style={{ flex: 1 }} showExcerpt={true} cardColor="var(--card-tan)" hasPattern={true} />
                    ) : (
                        <Box sx={{ flex: 1, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'white' }}>
                            Hero Slot Empty
                        </Box>
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Box sx={{ flex: 1, minHeight: '200px', display: 'flex' }}>
                        {topRight ? (
                            <FeaturedCard post={topRight} style={{ flex: 1, background: 'var(--card-green)' }} />
                        ) : (
                            <Box sx={{ flex: 1, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'white' }}>
                                Top Right Slot Empty
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ flex: 1, minHeight: '200px', display: 'flex' }}>
                        {middleList && middleList.length > 0 ? (
                            <FeaturedCard post={middleList[0]} style={{ flex: 1, background: 'var(--card-peach)' }} />
                        ) : (
                            <Box sx={{ flex: 1, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'white' }}>
                                Middle Slot Empty
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ flex: 1, minHeight: '200px', display: 'flex' }}>
                        {bottomRight ? (
                            <FeaturedCard post={bottomRight} style={{ flex: 1, background: 'var(--card-blue)' }} />
                        ) : (
                            <Box sx={{ flex: 1, borderRadius: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'white' }}>
                                Bottom Right Slot Empty
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});

FeaturedCard.displayName = 'FeaturedCard';
ListItem.displayName = 'ListItem';
BentoGrid.displayName = 'BentoGrid';

export default BentoGrid;
