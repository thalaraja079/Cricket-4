<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site cricpulse-wrapper">
    <!-- Clean, Sleek CricPulse Global Header with Pages Navigation -->
    <header class="cricpulse-site-header">
        <div class="cricpulse-container header-inner">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="cricpulse-brand-link">
                <span class="brand-icon">🏏</span>
                <span class="brand-name">CRICPULSE</span>
                <span class="brand-tagline">LIVE</span>
            </a>

            <!-- Navigation Links (Includes About, Contact, Privacy, Terms) -->
            <nav class="cricpulse-main-nav">
                <?php
                if (has_nav_menu('primary')) {
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'menu_class'     => 'cricpulse-nav-list',
                        'container'      => false,
                        'fallback_cb'    => false,
                    ));
                } else {
                ?>
                <ul class="cricpulse-nav-list">
                    <li><a href="<?php echo esc_url(home_url('/')); ?>">Home</a></li>
                    <li><a href="<?php echo esc_url(home_url('/#live')); ?>">Live Scores</a></li>
                    <li><a href="<?php echo esc_url(home_url('/#upcoming')); ?>">Upcoming</a></li>
                    <li><a href="<?php echo esc_url(home_url('/#points-table')); ?>">Points Table</a></li>
                    <li><a href="<?php echo esc_url(home_url('/#results')); ?>">Results</a></li>
                    <li><a href="<?php echo esc_url(home_url('/about-us')); ?>">About Us</a></li>
                    <li><a href="<?php echo esc_url(home_url('/contact')); ?>">Contact Us</a></li>
                    <li><a href="<?php echo esc_url(home_url('/privacy-policy')); ?>">Privacy Policy</a></li>
                    <li><a href="<?php echo esc_url(home_url('/terms-conditions')); ?>">Terms & Conditions</a></li>
                </ul>
                <?php } ?>
            </nav>
        </div>
    </header>
