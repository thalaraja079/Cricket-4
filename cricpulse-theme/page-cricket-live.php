<?php
/**
 * Template Name: Cricket Live Scores Full-Width
 * Description: A full-width page template for live cricket scores, upcoming fixtures, and points table.
 */

get_header();
?>

<?php
$display_mode = get_option('cricpulse_display_mode', 'full_app');
$google_key = get_option('cricpulse_google_api_key', '');
$app_url = get_option('cricpulse_app_url', 'https://ais-pre-l7rpu6rp447fkbekgmjxfs-966236010412.asia-southeast1.run.app');
if (!empty($google_key)) {
    $app_url = add_query_arg('apiKey', $google_key, $app_url);
}
?>

<main id="primary" class="site-main">
    <div class="cricpulse-container" style="padding-top: 24px;">
        <div id="cp-live-root"></div>
    </div>
</main>

<?php
get_footer();
