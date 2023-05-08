const database = require('../database/database.js');

const obj1 = {
    base_price: 8.5,
    radio: {
        region: {
            eu: {
                is_coef: true,
                value: 1
            },
            us: {
                is_coef: true,
                value: 1.2
            }
        },
        faction: {
            horde: {
                is_coef: true,
                value: 1
            },
            alliance: {
                is_coef: true,
                value: 1
            }
        },
        boost_method: {
            self_play: {
                is_coef: true,
                value: 1
            },
            piloted: {
                is_coef: true,
                value: 1.06
            },
            remote_control: {
                is_coef: true,
                value: 1
            }
        },
        execution_options: {
            normal: {
                is_coef: true,
                value: 1
            },
            extra_fast: {
                is_coef: false,
                value: 8.28
            },
            faster_25: {
                is_coef: false,
                value: 3.31
            },
            faster_50: {
                is_coef: false,
                value: 5.8
            }
        }
    },
    range: {
        levels: {
            is_coef: false,
            value: 0.74
        }
    },
    checkbox: {
        additional_options: {
            Heroic_plus_free: {
                is_coef: false,
                value: 18.15
            },
            mythic: {
                is_coef: false,
                value: 40.59
            },
            honor_gear: {
                is_coef: false,
                value: 45.93
            },
            s500000_gold: {
                is_coef: false,
                value: 32.04
            }
        }
    },
    select: {
        multiple_character_leveling: {
            characters_1: {
                is_coef: false,
                value: 0
            },
            characters_2: {
                is_coef: false,
                value: 15.12
            },
            characters_3: {
                is_coef: false,
                value: 29.43
            },
            characters_4: {
                is_coef: false,
                value: 43.24
            },
            characters_5: {
                is_coef: false,
                value: 56.71
            },
            characters_6: {
                is_coef: false,
                value: 68.71
            }
        }
    }
};
const obj2 = {
    base_price: 8.5,
    radio: {
        region: {
            eu: {
                is_coef: true,
                value: 1
            },
            us: {
                is_coef: true,
                value: 1.2
            }
        },
        faction: {
            horde: {
                is_coef: true,
                value: 1
            },
            alliance: {
                is_coef: true,
                value: 1
            }
        },
        boost_method: {
            self_play: {
                is_coef: true,
                value: 1
            },
            piloted: {
                is_coef: true,
                value: 1.06
            },
            remote_control: {
                is_coef: true,
                value: 1
            }
        },
        execution_options: {
            normal: {
                is_coef: true,
                value: 1
            },
            extra_fast: {
                is_coef: false,
                value: 8.28
            },
            faster_25: {
                is_coef: false,
                value: 3.31
            },
            faster_50: {
                is_coef: false,
                value: 5.8
            }
        }
    },
    range: {
        levels: {
            is_coef: false,
            value: 0.74
        }
    },
    checkbox: {
        additional_options: {
            Heroic_plus_free: {
                is_coef: false,
                value: 18.15
            },
            mythic: {
                is_coef: false,
                value: 40.59
            },
            honor_gear: {
                is_coef: false,
                value: 45.93
            },
            s500000_gold: {
                is_coef: false,
                value: 32.04
            }
        }
    }
};
const obj3 = {
    base_price: 1,
    radio: {
        region: {
            eu: {
                is_coef: true,
                value: 1
            },
            us: {
                is_coef: true,
                value: 1.5
            }
        },
        boost_method: {
            self_play: {
                is_coef: true,
                value: 1
            },
            piloted: {
                is_coef: true,
                value: 1
            },
        },
    },
    checkbox: {
        additional_options: {
            cutting_edge_raszageth: {
                is_coef: false,
                value: 318.03
            },
            mythic: {
                is_coef: false,
                value: 23.84
            },
            s500000_gold: {
                is_coef: false,
                value: 27.61
            }
        }
    }
};
const obj4 = {
    base_price: 20,
    radio: {
        region: {
            eu: {
                is_coef: true,
                value: 1
            },
            us: {
                is_coef: true,
                value: 1.21
            }
        },
        faction: {
            horde: {
                is_coef: true,
                value: 1
            },
            alliance: {
                is_coef: true,
                value: 1
            }
        },
        boost_method: {
            self_play: {
                is_coef: true,
                value: 1
            },
            piloted: {
                is_coef: true,
                value: 1
            },
        },
    },
    range: {
        rank: {
            is_coef: false,
            value: 0.1
        }
    },
    checkbox: {
        additional_options: {
            fast_start_completion: {
                is_coef: false,
                value: 16.5
            },
            one_win_guarantee: {
                is_coef: false,
                value: 22
            },
            with_a_live_stream: {
                is_coef: false,
                value: 5.5
            },
        }
    },
    select: {
        pvp_gear_farm: {
            characters_1: {
                is_coef: false,
                value: 0
            },
            characters_2: {
                is_coef: false,
                value: 35
            },
            characters_3: {
                is_coef: false,
                value: 350
            },
        }
    }
};
const obj5 = {
    base_price: 37.2,
    radio: {
        platform: {
            pc: {
                is_coef: true,
                value: 1
            },
            xbox: {
                is_coef: true,
                value: 1
            },
            ps: {
                is_coef: true,
                value: 1
            },
            switch: {
                is_coef: true,
                value: 1
            },
        },
        region: {
            europe: {
                is_coef: true,
                value: 1
            },
            americas: {
                is_coef: true,
                value: 1
            },
            asia: {
                is_coef: true,
                value: 1
            },
        },
        execution_options: {
            normal: {
                is_coef: true,
                value: 1
            },
            express: {
                is_coef: false,
                value: 8
            },
            super_express: {
                is_coef: false,
                value: 16
            },
        },
    },
    range: {
        rank: {
            is_coef: false,
            value: 43
        }
    },
    checkbox: {
        additional_options: {
            placement_matches: {
                is_coef: false,
                value: 149
            },
            competitive_unlock: {
                is_coef: false,
                value: 100
            },
            specific_heroes: {
                is_coef: false,
                value: 63
            },
            i_have_3_plus_defeats: {
                is_coef: false,
                value: 157
            },
            stream: {
                is_coef: false,
                value: 10
            },
        }
    }   
};
const obj6 = {
    base_price: 900,
    radio: {
        platform: {
            pc: {
                is_coef: true,
                value: 1
            },
            xbox: {
                is_coef: true,
                value: 1
            },
            ps: {
                is_coef: true,
                value: 1
            },
            switch: {
                is_coef: true,
                value: 1
            },
        },
        region: {
            europe: {
                is_coef: true,
                value: 1
            },
            americas: {
                is_coef: true,
                value: 1
            },
            asia: {
                is_coef: true,
                value: 1
            },
        },
        execution_options: {
            normal: {
                is_coef: true,
                value: 1
            },
            express: {
                is_coef: false,
                value: 300
            },
            super_express: {
                is_coef: false,
                value: 400
            },
        },
    },
    select: {
        rank: {
            bronze: {
                is_coef: false,
                value: 400
            },
            silver: {
                is_coef: false,
                value: 350
            },
            gold: {
                is_coef: false,
                value: 300
            },
            platinum: {
                is_coef: false,
                value: 250
            },
            diamond: {
                is_coef: false,
                value: 200
            },
            master: {
                is_coef: false,
                value: 150
            },
            grandmaster: {
                is_coef: false,
                value: 0
            }
        }
    }
};
const obj7 = {
    base_price: 500,
    radio: {
        platform: {
            pc: {
                is_coef: true,
                value: 1
            },
            xbox: {
                is_coef: true,
                value: 1
            },
            ps: {
                is_coef: true,
                value: 1
            },
            switch: {
                is_coef: true,
                value: 1
            },
        },
        region: {
            europe: {
                is_coef: true,
                value: 1
            },
            americas: {
                is_coef: true,
                value: 1
            },
            asia: {
                is_coef: true,
                value: 1
            },
        },
        execution_options: {
            normal: {
                is_coef: true,
                value: 1
            },
            express: {
                is_coef: false,
                value: 150
            },
            super_express: {
                is_coef: false,
                value: 250
            },
        },
    },
    checkbox: {
        additional_options: {
            competitive_unlock: {
                is_coef: false,
                value: 100
            },
            specific_heroes: {
                is_coef: false,
                value: 100
            },
            stream: {
                is_coef: false,
                value: 0
            },
        }
    }   
};
const obj8 = {
    base_price: 7,
    radio: {
        platform: {
            pc: {
                is_coef: true,
                value: 1
            },
            xbox: {
                is_coef: true,
                value: 1
            },
            ps: {
                is_coef: true,
                value: 1
            },
            switch: {
                is_coef: true,
                value: 1
            },
        },
        region: {
            europe: {
                is_coef: true,
                value: 1
            },
            americas: {
                is_coef: true,
                value: 1
            },
            asia: {
                is_coef: true,
                value: 1
            },
        },
        execution_options: {
            normal: {
                is_coef: true,
                value: 1
            },
            express: {
                is_coef: false,
                value: 1.75
            },
            super_express: {
                is_coef: false,
                value: 3.5
            },
        },
        queue: {
            tank: {
                is_coef: true,
                value: 1
            },
            damage: {
                is_coef: false,
                value: 0
            },
            support: {
                is_coef: false,
                value: 0
            },
            open: {
                is_coef: false,
                value: 0
            },
        },
        wins: {
            one: {
                is_coef: true,
                value: 1
            },
            two: {
                is_coef: false,
                value: 7
            },
            three: {
                is_coef: false,
                value: 14
            },
            four: {
                is_coef: false,
                value: 21
            },
            five: {
                is_coef: false,
                value: 28
            },
        },
    },
    checkbox: {
        additional_options: {
            competitive_unlock: {
                is_coef: false,
                value: 100
            },
            specific_heroes: {
                is_coef: false,
                value: 25
            },
            stream: {
                is_coef: false,
                value: 10
            },
        }
    },
    select: {
        rank: {
            unranked: {
                is_coef: false,
                value: 20
            },
            bronze: {
                is_coef: false,
                value: 20
            },
            silver: {
                is_coef: false,
                value: 20
            },
            gold: {
                is_coef: false,
                value: 25
            },
            platinum: {
                is_coef: false,
                value: 35
            },
            diamond: {
                is_coef: false,
                value: 70
            },
            master: {
                is_coef: false,
                value: 120
            },
            grandmaster: {
                is_coef: false,
                value: 175
            },
            top_500: {
                is_coef: false,
                value: 200
            }
        }
    }
};
const obj9 = {
    base_price: 200,
    checkbox: {
        additional_options: {
            upgraded_version: {
                is_coef: false,
                value: 100
            },
            build_coaching: {
                is_coef: false,
                value: 20
            },
        }
    },
    select: {
        multiple_character_leveling: {
            righteous_fire: {
                is_coef: false,
                value: 0
            },
            toxic_rain: {
                is_coef: false,
                value: 0
            },
            venom_gyre: {
                is_coef: false,
                value: 0
            },
            boneshatter: {
                is_coef: false,
                value: 0
            },
            summon_raging_spirit: {
                is_coef: false,
                value: 0
            },
            explosive_arrow: {
                is_coef: false,
                value: 0
            },
            cyclone: {
                is_coef: false,
                value: 0
            },
            cold_dot_elementalist: {
                is_coef: false,
                value: 0
            },
            poison_ancestral_protector_totem: {
                is_coef: false,
                value: 0
            },
            hexblast_miner: {
                is_coef: false,
                value: 0
            },
            corrupting_fever: {
                is_coef: false,
                value: 0
            }
        }
    }
};
const obj10 = {
    base_price: 0,
    radio: {
        league: {
            the_crucible: {
                is_coef: false,
                value: 0
            },
            standard: {
                is_coef: false,
                value: 64.17
            },
        },
        boost_method: {
            self_play: {
                is_coef: true,
                value: 1
            },
            piloted: {
                is_coef: true,
                value: 1
            },
        },

    },
    range: {
        levels: {
            is_coef: false,
            value: 0.46
        }
    },
    select: {
        multiple_character_leveling: {
            medium: {
                is_coef: false,
                value: 160
            },
            high: {
                is_coef: false,
                value: 270
            },
            meta: {
                is_coef: false,
                value: 460
            },
            meta_megablood: {
                is_coef: false,
                value: 660
            },
        }
    }
};
const obj11 = {
    base_price: 0,
    radio: {
        difficult: {
            softcore: {
                is_coef: false,
                value: 0
            },
            hardcore: {
                is_coef: false,
                value: 120
            },
        },
        league: {
            the_crucible: {
                is_coef: false,
                value: 0
            },
            standard: {
                is_coef: false,
                value: 0
            },
        },
        boost_method: {
            self_play: {
                is_coef: true,
                value: 1
            },
            piloted: {
                is_coef: true,
                value: 1
            },
        },

    },
    checkbox: {
        bosses: {
            cortex: {
                is_coef: false,
                value: 20
            },
            eater_of_worlds: {
                is_coef: false,
                value: 20
            },
            maven: {
                is_coef: false,
                value: 20
            },
            searing_exarch: {
                is_coef: false,
                value: 20
            },
            sirus: {
                is_coef: false,
                value: 20
            },
            shaper: {
                is_coef: false,
                value: 20
            },
            elder: {
                is_coef: false,
                value: 20
            },
        },
    }
};
const obj12 = {
    base_price: 0,
    radio: {
        league: {
            the_crucible: {
                is_coef: false,
                value: 0
            },
            standard: {
                is_coef: false,
                value: 3.75
            },
        },
        boost_method: {
            self_play: {
                is_coef: false,
                value: 0.25
            },
            piloted: {
                is_coef: true,
                value: 1
            },
        },
    },
    range: {
        levels: {
            is_coef: false,
            value: 2.5
        }
    },
};

const title1 = 'vault_of_the_incarnates_normal_raid_run';
const title2 = 'wow_dragonflight_level_boost';
const title3 = 'raszageth_heroic_kill';
const title4 = 'wow_arena_3v3_rating_boost';
const title5 = 'overwatch_sr_boost';
const title6 = 'overwatch_top_500_boost';
const title7 = 'overwatch_weapon_for_sale';
const title8 = 'overwatch_placement_matches_boost';
const title9 = 'poe_league_starter_builds_services';
const title10 = 'poe_custom_build';
const title11 = 'poe_pinnacle_bosses';
const title12 = 'poe_5_way_carry_services';

//database.query('DELETE FROM price_formation WHERE price_name=$1', [title12]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title1, JSON.stringify(obj1)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title2, JSON.stringify(obj2)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title3, JSON.stringify(obj3)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title4, JSON.stringify(obj4)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title5, JSON.stringify(obj5)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title6, JSON.stringify(obj6)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title7, JSON.stringify(obj7)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title8, JSON.stringify(obj8)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title9, JSON.stringify(obj9)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title10, JSON.stringify(obj10)]);
//database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title11, JSON.stringify(obj11)]);
database.query('INSERT INTO price_formation (price_name, price_data) values ($1, $2)', [title12, JSON.stringify(obj12)]);
