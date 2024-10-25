<?php
/**
 * GeneratePress child theme functions and definitions.
 *
 * Add your custom PHP in this file.
 * Only edit this file if you have direct access to it on your server (to fix errors if they happen).
 */
add_action('wp_enqueue_scripts', 'theme_enqueue_styles');
function theme_enqueue_styles()
{
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('theme-style', get_stylesheet_directory_uri() . '/theme.css', array(), filemtime(get_stylesheet_directory() . '/theme.css'));
}

function ajouter_lien_admin_pour_utilisateurs_connectes($items, $args) {
    // Vérifie si l'utilisateur est connecté
    if (is_user_logged_in()) {
        // Crée un lien "Admin"
        $lien_admin = '<li class="menu-item "><a href="' . admin_url() . '">Admin</a></li>';
        // Cherche la position du lien "Nous rencontrer"
        $position = strpos($items, 'Nous rencontrer');
        if ($position !== false) {
            // Si trouvé, insère le lien admin juste après "Nous rencontrer"
            $items = substr_replace($items, $lien_admin, $position + strlen('Nous rencontrer'), 0);
        } else {
            // Si "Nous rencontrer" n'est pas trouvé, ajoute à la fin
            $items .= $lien_admin;
        }
    }
    return $items;
}

// Accroche notre fonction au hook 'wp_nav_menu_items'
add_filter('wp_nav_menu_items', 'ajouter_lien_admin_pour_utilisateurs_connectes', 10, 2);



?>