<?php
/**
 * Plugin Name: Vectr
 * Description: Vectr description
 * Version: 1.0.0
 * Author: Germán Lena <german.lena@gmail.com>
 * Author URI: https://germanlena.com.ar
 */

define( 'WPVCR_PLUGIN_FILE', __FILE__ );
define( 'WPVCR_PLUGIN_DIR', trailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'WPVCR_PLUGIN_URL', trailingslashit( plugin_dir_url( __FILE__ ) ) );

class Vectr
{

  function init()
  {
    add_action( 'admin_head', array( $this, 'vectr_add_tinymce' ) );
  }

  public function vectr_add_tinymce()
  {
    global $typenow;

    if( ! in_array( $typenow, array( 'post', 'page' ) ) )
    {
      return;
    }

    add_filter( 'mce_external_plugins', array( $this, 'vectr_add_tinymce_plugin' ) , 999 );
    add_filter( 'mce_buttons', array( $this, 'vectr_add_tinymce_button' ) , 999 );
    wp_enqueue_style( 'css_vectr', WPVCR_PLUGIN_URL . 'css/vectr.css', false, '1.0', 'all' );
    wp_enqueue_style( 'css_mce_vectr', WPVCR_PLUGIN_URL . 'css/mce_vectr.css', false, '1.0', 'all' );
    wp_enqueue_script( 'js_mce_vectr', WPVCR_PLUGIN_URL . 'js/vectr.js', false, '1.0', true);
  }

  public function vectr_add_tinymce_plugin( $plugin_array )
  {
    $plugin_array['vectr'] = WPVCR_PLUGIN_URL . 'js/mce_vectr.js';
    return $plugin_array;
  }

  // Add the button key for address via JS
  public function vectr_add_tinymce_button( $buttons )
  {
    array_push( $buttons, 'vectr' );
    return $buttons;
  }
}

$vectr = new Vectr();
$vectr->init();