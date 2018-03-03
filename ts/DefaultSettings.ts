export let default_settings = {
    github: {
        user: "tomdaniel-it",
        api_url: "https://api.github.com",
        info_file_name: "GitHub-Overview-Info.json",
    },
    game: {
        frame_rate: 120,
        skyscraper_min_height_difference: 0,
        skyscraper_max_height_difference: 100,
        skyscraper_space_inbetween: 100,
        window_margin_horizontal: 100,
        crate_margin_right_of_edge: 50,
        hint_color: "orange",
        player_jump_force:10,
        player_gravity: 2,
        player_max_fall_speed: 10,
        player_walk_speed: 3,
        billboard: {
            letter_move_speed: 1,
            letter_distance: 2,
            letter_space_width: 10,
            letter_height: 25,
            letter_start_margin: 20,
            letter_repeat_loop_margin: 80,
        },
        plane: {
            margin_top: 60,
            height: 200,
            starting_pos_margin_from_screen: 50,
            sprite_change_delay: 50,
            speed: 2,
            title_color: "black",
            description_color: "black",
        },
    },
    images: {
        skyscraper_amount: 7,
    }
};