<?php
/**
 * CricPulse Theme Functions and Definitions
 * Full WordPress Blog, Articles, Custom Pages & Native Live Cricket Scoreboard
 * Integrates with Google Search Grounding (gemini-3.5-flash), BigBallsData.com & CricAPI
 */

if (!defined('ABSPATH')) {
    exit;
}

function cricpulse_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    add_theme_support('html5', array('comment-list', 'comment-form', 'search-form', 'gallery', 'caption', 'style', 'script'));

    register_nav_menus(array(
        'primary' => __('Primary Menu', 'cricpulse-theme'),
        'footer'  => __('Footer Menu', 'cricpulse-theme'),
    ));
}
add_action('after_setup_theme', 'cricpulse_theme_setup');

function cricpulse_enqueue_scripts() {
    wp_enqueue_style(
        'cricpulse-fonts',
        'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Rajdhani:wght@600;700&display=swap',
        array(),
        null
    );

    wp_enqueue_style('cricpulse-style', get_stylesheet_uri(), array(), '2.2.0');

    // Always enqueue standalone native cricket app for 100% reliable Hostinger WordPress execution
    wp_enqueue_style(
        'cricpulse-app-style',
        get_template_directory_uri() . '/assets/cricket-app.css',
        array(),
        '2.2.0'
    );

    wp_enqueue_script(
        'cricpulse-app-script',
        get_template_directory_uri() . '/assets/cricket-app.js',
        array(),
        '2.2.0',
        true
    );

    wp_localize_script('cricpulse-app-script', 'cricpulseConfig', array(
        'googleApiKey' => get_option('cricpulse_google_api_key', ''),
        'apiKey'       => get_option('cricpulse_api_key', ''),
        'provider'     => get_option('cricpulse_provider', 'google_trending'),
        'lang'         => 'en',
        'defaultTab'   => 'live',
        'manualMatch'  => array(
            'title' => get_option('cricpulse_manual_upcoming_title', ''),
            'time'  => get_option('cricpulse_manual_datetime', ''),
            'venue' => get_option('cricpulse_manual_venue', ''),
        ),
        'customBanner' => get_option('cricpulse_custom_banner', ''),
        'restEndpoint' => esc_url_raw(rest_url('cricpulse/v1/live')),
        'nonce'        => wp_create_nonce('wp_rest'),
    ));
}
add_action('wp_enqueue_scripts', 'cricpulse_enqueue_scripts');

/**
 * Register WordPress REST API route to query live matches
 * GET /wp-json/cricpulse/v1/live
 */
add_action('rest_api_init', function () {
    register_rest_route('cricpulse/v1', '/live', array(
        'methods'             => 'GET',
        'callback'            => 'cricpulse_rest_get_live_matches',
        'permission_callback' => '__return_true',
    ));
});

function cricpulse_rest_get_live_matches() {
    $provider = get_option('cricpulse_provider', 'google_trending');
    $google_key = get_option('cricpulse_google_api_key', '');
    $api_key = get_option('cricpulse_api_key', '');

    $cache_key = 'cricpulse_live_cache';
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return new WP_REST_Response($cached, 200);
    }

    if ($provider === 'google_trending') {
        // Query CricPulse App Live Endpoint with Google Search Grounding
        $app_base = get_option('cricpulse_app_url', 'https://ais-pre-l7rpu6rp447fkbekgmjxfs-966236010412.asia-southeast1.run.app');
        $app_proxy_url = rtrim($app_base, '/') . '/api/cricket/trending-live';
        $headers = array('Accept' => 'application/json');
        if (!empty($google_key)) {
            $headers['x-gemini-api-key'] = trim($google_key);
        }
        $response = wp_remote_get($app_proxy_url, array('headers' => $headers, 'timeout' => 15));
    } elseif ($provider === 'bigballsdata') {
        $url = 'https://api.bigballsdata.com/v1/cricket/matches';
        $response = wp_remote_get($url, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . trim($api_key),
                'Accept'        => 'application/json',
            ),
            'timeout' => 15,
        ));
    } else {
        $url = 'https://api.cricapi.com/v1/currentMatches?apikey=' . urlencode(trim($api_key)) . '&offset=0';
        $response = wp_remote_get($url, array('timeout' => 15));
    }

    if (is_wp_error($response)) {
        return new WP_REST_Response(array(
            'status'  => 'error',
            'message' => $response->get_error_message(),
        ), 500);
    }

    $status_code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    $result = array(
        'status'     => ($status_code >= 200 && $status_code < 300) ? 'success' : 'api_error',
        'http_code'  => $status_code,
        'provider'   => $provider,
        'data'       => $data,
        'queried_at' => gmdate('Y-m-d H:i:s') . ' UTC',
    );

    if ($status_code === 200) {
        set_transient($cache_key, $result, 60);
    }

    return new WP_REST_Response($result, 200);
}

/**
 * Shortcode to render live cricket score anywhere
 * Usage: [cricpulse_live]
 */
function cricpulse_theme_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '950px',
    ), $atts, 'cricpulse_live');

    $display_mode = get_option('cricpulse_display_mode', 'full_app');
    $google_key = get_option('cricpulse_google_api_key', '');
    $app_url = get_option('cricpulse_app_url', 'https://ais-pre-l7rpu6rp447fkbekgmjxfs-966236010412.asia-southeast1.run.app');
    if (!empty($google_key)) {
        $app_url = add_query_arg('apiKey', $google_key, $app_url);
    }

    if ($display_mode === 'full_app') {
        return '<div class="cricpulse-container" style="max-width: 1280px; margin: 20px auto; padding: 0 15px;"><div style="width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.5); background: #020617;"><iframe src="' . esc_url($app_url) . '" style="width: 100%; height: ' . esc_attr($atts['height']) . '; border: none; display: block;" allow="autoplay; clipboard-write; microphone" loading="lazy" title="CricPulse Live Cricket"></iframe></div></div>';
    }

    return '<div class="cricpulse-container"><div id="cp-live-root"></div></div>';
}
add_shortcode('cricpulse_live', 'cricpulse_theme_shortcode');

/**
 * Register WordPress Admin Settings Page: Settings -> Cricket Live API
 */
function cricpulse_add_admin_menu() {
    add_options_page(
        __('Cricket Live API Settings', 'cricpulse-theme'),
        __('Cricket Live API 🏏', 'cricpulse-theme'),
        'manage_options',
        'cricpulse-api-settings',
        'cricpulse_render_api_settings_page'
    );
}
add_action('admin_menu', 'cricpulse_add_admin_menu');

function cricpulse_register_settings() {
    register_setting('cricpulse_options_group', 'cricpulse_app_url');
    register_setting('cricpulse_options_group', 'cricpulse_display_mode');
    register_setting('cricpulse_options_group', 'cricpulse_provider');
    register_setting('cricpulse_options_group', 'cricpulse_google_api_key');
    register_setting('cricpulse_options_group', 'cricpulse_api_key');
    register_setting('cricpulse_options_group', 'cricpulse_manual_upcoming_title');
    register_setting('cricpulse_options_group', 'cricpulse_manual_datetime');
    register_setting('cricpulse_options_group', 'cricpulse_manual_venue');
    register_setting('cricpulse_options_group', 'cricpulse_custom_banner');
}
add_action('admin_init', 'cricpulse_register_settings');

function cricpulse_render_api_settings_page() {
    $app_url = get_option('cricpulse_app_url', 'https://ais-pre-l7rpu6rp447fkbekgmjxfs-966236010412.asia-southeast1.run.app');
    $display_mode = get_option('cricpulse_display_mode', 'full_app');
    $provider = get_option('cricpulse_provider', 'google_trending');
    $google_key = get_option('cricpulse_google_api_key', '');
    $api_key = get_option('cricpulse_api_key', '');
    $manual_title = get_option('cricpulse_manual_upcoming_title', '');
    $manual_datetime = get_option('cricpulse_manual_datetime', '');
    $manual_venue = get_option('cricpulse_manual_venue', '');
    $custom_banner = get_option('cricpulse_custom_banner', '');
    $test_result = null;

    if (isset($_POST['cricpulse_test_connection'])) {
        check_admin_referer('cricpulse_test_nonce');
        
        $test_url = rtrim($app_url, '/') . '/api/health';
        $headers = array('Accept' => 'application/json');
        if (!empty($google_key)) {
            $headers['x-gemini-api-key'] = trim($google_key);
        }
        $res = wp_remote_get($test_url, array('headers' => $headers, 'timeout' => 15));

        if (is_wp_error($res)) {
            $test_result = array('success' => false, 'msg' => $res->get_error_message());
        } else {
            $code = wp_remote_retrieve_response_code($res);
            $body = wp_remote_retrieve_body($res);
            $test_result = array(
                'success' => ($code === 200),
                'code'    => $code,
                'body'    => $body
            );
        }
    }
    ?>
    <div class="wrap" style="max-width: 900px; background: #fff; padding: 25px 30px; border-radius: 12px; margin-top: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 32px;">🏏</span>
                <div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a;">
                        CricPulse Cricket Live Settings (கிரிக்கெட் நேரலை அமைப்புகள்)
                    </h1>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">
                        கூகுள் தேடலில் அதிகம் தேடப்படும் நேரலை கிரிக்கெட் ஸ்கோர்களை உங்கள் இணையதளத்தில் இணைக்கலாம்.
                    </p>
                </div>
            </div>
            <span style="background: #ecfdf5; color: #059669; border: 1px solid #10b981; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;">
                v2.0.0
            </span>
        </div>

        <?php if ($test_result) : ?>
            <div style="margin-top: 20px; padding: 14px 18px; border-radius: 8px; <?php echo $test_result['success'] ? 'background:#ecfdf5; border:1px solid #10b981; color:#065f46;' : 'background:#fef2f2; border:1px solid #ef4444; color:#991b1b;'; ?>">
                <strong><?php echo $test_result['success'] ? '✅ கூகுள் டிரெண்டிங் லைவ் API உடன் வெற்றிகரமாக இணைக்கப்பட்டது! (HTTP 200 OK)' : '❌ இணைப்பு பிழை (HTTP ' . esc_html($test_result['code']) . ')'; ?></strong>
                <p style="margin: 6px 0 0; font-size: 12px; font-family: monospace;">
                    <?php echo esc_html($test_result['success'] ? $test_result['body'] : $test_result['msg']); ?>
                </p>
            </div>
        <?php endif; ?>

        <form method="post" action="options.php" style="margin-top: 20px;">
            <?php settings_fields('cricpulse_options_group'); ?>
            
            <table class="form-table" role="presentation">
                <tr valign="top">
                    <th scope="row" style="width: 260px;">
                        <strong style="font-size: 14px; color: #0f172a;">CricPulse App URL</strong><br>
                        <small style="color: #64748b;">(நேரலை ஆப் சர்வர் முகவரி)</small>
                    </th>
                    <td>
                        <input type="url" name="cricpulse_app_url" value="<?php echo esc_attr($app_url); ?>" style="width: 100%; max-width: 550px; padding: 9px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-family: monospace;" placeholder="https://ais-pre-..." />
                        <p class="description" style="color: #64748b; margin-top: 6px;">
                            உங்கள் CricPulse நேரலை சேவையகத்தின் முழு முகவரி. இயல்பாகவே தற்போதைய லைவ் URL அமைக்கப்பட்டுள்ளது.
                        </p>
                    </td>
                </tr>

                <tr valign="top">
                    <th scope="row" style="width: 260px;">
                        <strong style="font-size: 14px; color: #0f172a;">காட்சி முறை (Display Mode)</strong>
                    </th>
                    <td>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #059669;">
                            <input type="radio" name="cricpulse_display_mode" value="full_app" <?php checked($display_mode, 'full_app'); ?>>
                            ⭐ Full CricPulse Live App (முழுமையான AI ஸ்டுடியோ பிரிவியூ தோற்றம் - பரிந்துரைக்கப்படுகிறது)
                        </label>
                        <label style="display: block; color: #475569;">
                            <input type="radio" name="cricpulse_display_mode" value="native" <?php checked($display_mode, 'native'); ?>>
                            Native Theme Lightweight Scoreboard (எளிமையான நேட்டிவ் ஸ்கோர்போர்டு)
                        </label>
                        <p class="description" style="color: #64748b; margin-top: 6px;">
                            'Full CricPulse Live App' தேர்வு செய்தால், AI ஸ்டுடியோவில் நீங்கள் பார்க்கும் அதே ஸ்டேடியம் டிசைன், ஆடியோ வர்ணனை, AI மேட்ச் கணிப்பு, புள்ளிகள் பட்டியல் என அனைத்தும் உங்கள் இணையதளத்தில் அப்படியே வரும்!
                        </p>
                    </td>
                </tr>

                <tr valign="top">
                    <th scope="row">
                        <strong style="font-size: 14px; color: #0f172a;">Live API Provider</strong>
                    </th>
                    <td>
                        <select name="cricpulse_provider" style="padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e1; width: 100%; max-width: 450px; font-weight: 600;">
                            <option value="google_trending" <?php selected($provider, 'google_trending'); ?>>🔍 Google Search Grounding (gemini-3.8-flash) - கூகுள் டிரெண்டிங்</option>
                            <option value="bigballsdata" <?php selected($provider, 'bigballsdata'); ?>>BigBallsData.com (Bearer Token)</option>
                            <option value="cricketdata" <?php selected($provider, 'cricketdata'); ?>>CricketData.org / CricAPI.com</option>
                        </select>
                    </td>
                </tr>

                <tr valign="top">
                    <th scope="row">
                        <strong style="font-size: 14px; color: #0f172a;">Live Cricket API Key</strong><br>
                        <small style="color: #64748b;">(நேரலை கிரிக்கெட் API கீ)</small>
                    </th>
                    <td>
                        <input type="text" name="cricpulse_google_api_key" value="<?php echo esc_attr(!empty($google_key) ? $google_key : $api_key); ?>" style="width: 100%; max-width: 480px; padding: 9px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-family: monospace;" placeholder="உங்கள் Google Gemini API Key அல்லது CricAPI Key" />
                        <p class="description" style="color: #64748b; margin-top: 6px;">
                            உங்கள் Google AI Studio (Gemini API Key) அல்லது CricAPI Key-ஐ இங்கே உள்ளிடவும். ஒரு முறை உள்ளிட்டால் போதுமானது.
                        </p>
                    </td>
                </tr>

                <tr valign="top">
                    <th colspan="2" style="padding-top: 24px; padding-bottom: 8px; border-top: 1px solid #e2e8f0;">
                        <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">
                            ✏️ Manual Match & Banner Manager (விருப்பத்திற்கேற்ப புதிய போட்டிகளை சேர்க்க)
                        </h3>
                        <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">
                            நீங்கள் விரும்பும் ஏதேனும் ஒரு புதிய போட்டியை மேனுவலாக அட்டவணையின் மேலே முன்னுரிமையுடன் காட்டலாம்.
                        </p>
                    </th>
                </tr>

                <tr valign="top">
                    <th scope="row">
                        <strong style="font-size: 13px; color: #0f172a;">Custom Top Banner Alert</strong><br>
                        <small style="color: #64748b;">(மேல் அறிவிப்பு பேனர்)</small>
                    </th>
                    <td>
                        <input type="text" name="cricpulse_custom_banner" value="<?php echo esc_attr($custom_banner); ?>" style="width: 100%; max-width: 550px; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1;" placeholder="எடுத்துக்காட்டு: 🔥 இன்று மதியம் 1:30 மணிக்கு இந்தியா vs வெஸ்ட் இண்டீஸ் 3வது ஒருநாள் போட்டி!" />
                    </td>
                </tr>

                <tr valign="top">
                    <th scope="row">
                        <strong style="font-size: 13px; color: #0f172a;">Manual Upcoming Match Title</strong><br>
                        <small style="color: #64748b;">(போட்டியின் பெயர்)</small>
                    </th>
                    <td>
                        <input type="text" name="cricpulse_manual_upcoming_title" value="<?php echo esc_attr($manual_title); ?>" style="width: 100%; max-width: 550px; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1;" placeholder="India vs West Indies • 3rd ODI" />
                    </td>
                </tr>

                <tr valign="top">
                    <th scope="row">
                        <strong style="font-size: 13px; color: #0f172a;">Date & Time</strong><br>
                        <small style="color: #64748b;">(தேதி & நேரம்)</small>
                    </th>
                    <td>
                        <input type="text" name="cricpulse_manual_datetime" value="<?php echo esc_attr($manual_datetime); ?>" style="width: 100%; max-width: 400px; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1;" placeholder="Saturday, Oct 3, 2026 • 1:30 PM IST" />
                    </td>
                </tr>

                <tr valign="top">
                    <th scope="row">
                        <strong style="font-size: 13px; color: #0f172a;">Venue Stadium</strong><br>
                        <small style="color: #64748b;">(அரங்கம் / மைதானம்)</small>
                    </th>
                    <td>
                        <input type="text" name="cricpulse_manual_venue" value="<?php echo esc_attr($manual_venue); ?>" style="width: 100%; max-width: 450px; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1;" placeholder="New Chandigarh (Mullanpur)" />
                    </td>
                </tr>
            </table>

            <?php submit_button('அமைப்புகளை சேமி (Save Settings)', 'primary', 'submit', true, array('style' => 'background: #059669; border-color: #047857; padding: 6px 20px; font-weight: 700; border-radius: 8px;')); ?>
        </form>

        <hr style="margin: 24px 0; border: 0; border-top: 1px solid #eee;">
        
        <form method="post" action="">
            <?php wp_nonce_field('cricpulse_test_nonce'); ?>
            <input type="hidden" name="cricpulse_test_connection" value="1">
            <button type="submit" class="button button-secondary" style="display: flex; align-items: center; gap: 8px; padding: 6px 14px; font-weight: 600;">
                📡 கூகுள் டிரெண்டிங் லைவ் இணைப்பை சோதிக்க (Test Live Connection)
            </button>
            <small style="color: #64748b; display: block; margin-top: 6px;">
                இதை கிளிக் செய்தால் நேரலை API சரியாக பதிலளிக்கிறதா என்பதை உடனே சோதித்துப் பார்க்கும்.
            </small>
        </form>
    </div>
    <?php
}
