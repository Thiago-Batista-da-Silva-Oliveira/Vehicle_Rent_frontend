import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  CardActions,
  Divider,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { 
  Check as CheckIcon,
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Map as MapIcon,
  CalendarMonth as CalendarIcon,
  PeopleAlt as PeopleIcon,
  Analytics as AnalyticsIcon,
  Menu as MenuIcon,
  KeyboardArrowRight as ArrowRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardImage from '../assets/dashboard.jpeg'
import MapImage from '../assets/map.jpeg'

// Feature section component
const FeatureSection: React.FC = () => {
  const theme = useTheme();
  
  const features = [
    {
      icon: <CarIcon fontSize="large" />,
      title: 'Vehicle Management',
      description: 'Track all your vehicles in one place. Add, update or remove vehicles easily with detailed information.'
    },
    {
      icon: <PeopleIcon fontSize="large" />,
      title: 'Client Management',
      description: 'Manage your client database efficiently. Keep track of client information, rental history, and preferences.'
    },
    {
      icon: <MapIcon fontSize="large" />,
      title: 'Real-time Tracking',
      description: 'Monitor your vehicles in real-time on an interactive map. Know exactly where each vehicle is at any moment.'
    },
    {
      icon: <CalendarIcon fontSize="large" />,
      title: 'Schedule Management',
      description: 'Plan rentals, maintenance, and appointments with our intuitive calendar interface.'
    },
    {
      icon: <SpeedIcon fontSize="large" />,
      title: 'Performance Analytics',
      description: 'Get insights into your fleet performance with detailed analytics and reports.'
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Secure System',
      description: 'Rest easy knowing your data is safe with our enterprise-grade security and access controls.'
    }
  ];
  
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Features to Supercharge Your Rental Business
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Vehicle_Rentx provides all the tools you need to manage your rental fleet efficiently
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[4],
                  }
                }}
                elevation={2}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    mb: 2, 
                    color: 'primary.main',
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Pricing section component
const PricingSection: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const plans = [
    {
      title: 'Free Trial',
      price: '$0',
      period: 'for 14 days',
      description: 'Perfect for testing the waters',
      features: [
        'Up to 5 vehicles',
        'Up to 10 clients',
        'Basic analytics',
        'Email support',
        'Standard map view',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'outlined',
      highlight: false,
    },
    {
      title: 'Pro',
      price: '$49',
      period: 'per month',
      description: 'Ideal for small to medium fleets',
      features: [
        'Up to 50 vehicles',
        'Unlimited clients',
        'Advanced analytics',
        'Priority support',
        'Real-time tracking',
        'API access',
        'Custom branding',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'contained',
      highlight: true,
    },
    {
      title: 'Enterprise',
      price: '$99',
      period: 'per month',
      description: 'For large fleets and agencies',
      features: [
        'Unlimited vehicles',
        'Unlimited clients',
        'Advanced analytics with exports',
        '24/7 premium support',
        'Advanced tracking features',
        'API access with higher limits',
        'Custom branding',
        'Dedicated account manager',
        'Custom integrations',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outlined',
      highlight: false,
    },
  ];
  
  return (
    <Box sx={{ py: 8, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Choose the Perfect Plan
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Start with a 14-day free trial, then select the plan that fits your business needs
          </Typography>
        </Box>
        
        <Grid container spacing={4} alignItems="center">
          {plans.map((plan, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  border: plan.highlight ? `2px solid ${theme.palette.primary.main}` : 'none',
                  transform: plan.highlight ? 'scale(1.05)' : 'none',
                  zIndex: plan.highlight ? 1 : 'auto',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: plan.highlight ? 'scale(1.07)' : 'scale(1.02)',
                    boxShadow: theme.shadows[10],
                  }
                }}
                elevation={plan.highlight ? 8 : 2}
              >
                {plan.highlight && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        py: 0.5,
                        px: 2,
                        borderRadius: 5,
                        display: 'inline-block',
                      }}
                    >
                      Most Popular
                    </Typography>
                  </Box>
                )}
                <CardHeader
                  title={plan.title}
                  titleTypographyProps={{ align: 'center', variant: 'h4', fontWeight: 'bold' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  sx={{
                    backgroundColor: plan.highlight ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  }}
                />
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography component="h2" variant="h3" color="primary.main" fontWeight="bold">
                      {plan.price}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {plan.period}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" align="center" sx={{ fontStyle: 'italic', mb: 2 }}>
                    {plan.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <List dense>
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex} disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={plan.buttonVariant as 'outlined' | 'contained'}
                    color="primary"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ py: 1.5 }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Testimonials section
const TestimonialsSection: React.FC = () => {
  const theme = useTheme();
  
  const testimonials = [
    {
      quote: "Vehicle_Rentx has revolutionized how we manage our fleet. The real-time tracking and maintenance scheduling have reduced our downtime by 35%.",
      author: "Sarah Johnson",
      position: "Fleet Manager, Rapid Rentals"
    },
    {
      quote: "The client management features alone have saved us countless hours. We can now provide a much more personalized service to our customers.",
      author: "Michael Chen",
      position: "CEO, Urban Mobility Solutions"
    },
    {
      quote: "As a small business owner, the analytics and reporting features have given me insights I never had before. It's like having a business consultant built into the software.",
      author: "David Rodriguez",
      position: "Owner, Sunset Car Rentals"
    }
  ];
  
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            What Our Customers Say
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Trusted by rental businesses of all sizes
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  p: 3,
                }}
                elevation={2}
              >
                <Box sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.1), position: 'absolute', top: 10, left: 10 }}>
                  "
                </Box>
                <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', minHeight: 120 }}>
                    "{testimonial.quote}"
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {testimonial.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.position}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// CTA Section
const CTASection: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  return (
    <Box 
      sx={{ 
        py: 10,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Transform Your Rental Business?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Start your 14-day free trial today. No credit card required.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              color="secondary"
              onClick={() => navigate('/register')}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: theme.shadows[4]
              }}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: alpha('#ffffff', 0.1)
                }
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

// Hero section component
const HeroSection: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  return (
    <Box 
      sx={{ 
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        bgcolor: theme.palette.mode === 'light' 
          ? alpha(theme.palette.primary.main, 0.05)
          : alpha(theme.palette.primary.dark, 0.2),
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.4,
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="bold" 
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Simplify Your <Box component="span" color="primary.main">Vehicle Rental</Box> Management
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                paragraph
                sx={{ mb: 4 }}
              >
                All-in-one platform to manage your fleet, track vehicles, handle clients, and boost your rental business.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ py: 1.5, px: 4 }}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ py: 1.5, px: 4 }}
                  endIcon={<ArrowRightIcon />}
                >
                  Sign In
                </Button>
              </Stack>
              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No credit card required • 14-day free trial • Cancel anytime
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: '120%',
                  height: '120%',
                  top: '-10%',
                  left: '-10%',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                  zIndex: -1,
                }}
              />
              <Paper
                elevation={6}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 4,
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                  boxShadow: theme.shadows[10],
                }}
              >
                <Box
                  component="img"
                  src={DashboardImage}
                  alt="Vehicle Rentx Dashboard"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </Paper>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-10%',
                  right: '10%',
                  width: '40%',
                  height: '40%',
                  borderRadius: 2,
                  boxShadow: theme.shadows[6],
                  overflow: 'hidden',
                  transform: 'rotate(10deg)',
                }}
              >
                <Box
                  component="img"
                  src={MapImage}
                  alt="Map tracking feature"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Navbar
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={1}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <CarIcon color="primary" fontSize="large" sx={{ mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              Vehicle_Rentx
            </Typography>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button color="inherit" onClick={() => navigate('/features')}>Features</Button>
            <Button color="inherit" onClick={() => navigate('/pricing')}>Pricing</Button>
            <Button color="inherit" onClick={() => navigate('/about')}>About</Button>
            <Button color="inherit" onClick={() => navigate('/contact')}>Contact</Button>
            <Button variant="outlined" color="primary" onClick={() => navigate('/login')} sx={{ ml: 2 }}>
              Sign In
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/register')} sx={{ ml: 1 }}>
              Sign Up
            </Button>
          </Box>
          
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

// Footer component
const Footer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 6,
        bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
        color: 'text.secondary',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <CarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="text.primary" fontWeight="bold">
                Vehicle_Rentx
              </Typography>
            </Box>
            <Typography variant="body2" paragraph>
              Simplifying vehicle rental management for businesses of all sizes.
            </Typography>
            <Box display="flex" gap={1}>
              {/* Social icons would go here */}
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" gutterBottom>
              Product
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Features</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Pricing</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Demo</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Updates</Button></Box>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" gutterBottom>
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>About</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Careers</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Blog</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Contact</Button></Box>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" gutterBottom>
              Resources
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Documentation</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Support</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>FAQ</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>API</Button></Box>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={3}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" gutterBottom>
              Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Terms of Service</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Privacy Policy</Button></Box>
              <Box component="li" mb={1}><Button color="inherit" sx={{ p: 0 }}>Security</Button></Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} Vehicle_Rentx. All rights reserved.
          </Typography>
          <Box>
            <Button color="inherit" size="small">Privacy</Button>
            <Button color="inherit" size="small">Terms</Button>
            <Button color="inherit" size="small">Cookies</Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Main landing page component
const Landing: React.FC = () => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ pt: 8 }}> {/* Padding top to compensate for fixed navbar */}
        <HeroSection />
        <FeatureSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </Box>
    </Box>
  );
};

export default Landing;