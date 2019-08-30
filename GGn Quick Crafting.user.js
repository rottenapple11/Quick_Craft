// ==UserScript==
// @name         GGn Quick Crafter
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Craft multiple items easier
// @author       KingKrab23
// @match        https://gazellegames.net/user.php?action=crafting
// @grant        none
// ==/UserScript==

const VERSION = '2.0.2';

/* >>>BEGIN<<< User adjustable variables
 * ONLY ADJUST THESE IF YOU KNOW WHAT YOU'RE DOING
 * Too little of a delay will cause more bugs */

const BUTTON_LOCKOUT_DELAY = 1000;
const CRAFT_TIME = 1000;
const GRAB_TIME = 1;
const NEXT_CRAFT_TIME = 1;

/* >>>END<<< user adjustable variables */

var blankSlot = "EEEEE";
var slots = [];
slots[0] = blankSlot;
slots[1] = blankSlot;
slots[2] = blankSlot;
slots[3] = blankSlot;
slots[4] = blankSlot;
slots[5] = blankSlot;
slots[6] = blankSlot;
slots[7] = blankSlot;
slots[8] = blankSlot;

function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getSlots() {
    var combinedSlots = "";

    var i = 0;
    for (i = 0; i < slots.length; i++)
        combinedSlots += slots[i];

    return combinedSlots;
}

var authKey = getUrlVars(document.getElementsByTagName('link')[4].href).authkey;
var urlBase = "https://gazellegames.net/user.php?action=ajaxtakecraftingresult&recipe=CUSTOMRECIPE&auth=" + authKey;

/* Used for dynamic button lockouts (i.e.: multicraft) */
var next_button_lockout_delay = BUTTON_LOCKOUT_DELAY;

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.disabled { background-color: #333 !important; color: #666 !important; }';
document.getElementsByTagName('head')[0].appendChild(style);

function getElement(itemId) {
    return "#items-wrapper .item[data-item='" + itemId + "']";
}

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

var ingredients = {};
ingredients["glass shards"] = "01988";
ingredients["test tube"] = "00125";
ingredients["vial"] = "00124";
ingredients["bowl"] = "00126";
ingredients["pile of sand"] = "01987";
ingredients["black elder leaves"] = "00115";
ingredients["black elderberries"] = "00114";
ingredients["yellow hellebore flower"] = "00113";
ingredients["upload potion"] = "00099";
ingredients["purple angelica flowers"] = "00111";
ingredients["garlic tincture"] = "00127";
ingredients["download-reduction potion"] = "00106";
ingredients["head of garlic"] = "00112";
ingredients["bronze alloy mix"] = "02225";
ingredients["clay"] = "02234";
ingredients["iron ore"] = "02226";
ingredients["lump of coal"] = "02233";
ingredients["iron bar"] = "02237";
ingredients["gold ore"] = "02227";
ingredients["adamantium ore"] = "02229";
ingredients["mithril ore"] = "02228";
ingredients["quartz dust"] = "02230";
ingredients["jade dust"] = "02231";
ingredients["amethyst dust"] = "02232";
ingredients["ruby-flecked wheat"] = "02579";
ingredients["emerald-flecked wheat"] = "02717";
ingredients["ruby-grained baguette"] = "02580";
ingredients["emerald-grained baguette"] = "02718";
ingredients["garlic ruby-baguette"] = "02581";
ingredients["garlic emerald-baguette"] = "02719";
ingredients["artisan emerald-baguette"] = "02720";
ingredients["emerald chip"] = "02551";
ingredients["quartz bar"] = "02242";
ingredients["carbon-crystalline quartz"] = "02537";
ingredients["ruby"] = "02323";
ingredients["sapphire"] = "02549";
ingredients["emerald"] = "00116";
ingredients["amethyst bar"] = "02244";
ingredients["dwarven gem"] = "02508";
ingredients["flux"] = "02653";

var onHand = {}; // .item_count").text()
function build_on_hand() {
    onHand["glass shards"] = $("#items-wrapper .item[data-item=" + ingredients["glass shards"] + "] .item_count").text();
    if (onHand["glass shards"] === "") { onHand["glass shards"] = $("#items-wrapper .item[data-item=" + ingredients["glass shards"] + "]").length; }

    onHand["test tube"] = $("#items-wrapper .item[data-item=" + ingredients["test tube"] + "] .item_count").text();
    if (onHand["test tube"] === "") { onHand["test tube"] = $("#items-wrapper .item[data-item=" + ingredients["test tube"] + "]").length; }

    onHand["vial"] = $("#items-wrapper .item[data-item=" + ingredients["vial"] + "] .item_count").text();
    if (onHand["vial"] === "") { onHand["vial"] = $("#items-wrapper .item[data-item=" + ingredients["vial"] + "]").length; }

    onHand["bowl"] = $("#items-wrapper .item[data-item=" + ingredients["bowl"] + "] .item_count").text();
    if (onHand["bowl"] === "") { onHand["bowl"] = $("#items-wrapper .item[data-item=" + ingredients["bowl"] + "]").length; }

    onHand["pile of sand"] = $("#items-wrapper .item[data-item=" + ingredients["pile of sand"] + "] .item_count").text();
    if (onHand["pile of sand"] === "") { onHand["pile of sand"] = $("#items-wrapper .item[data-item=" + ingredients["pile of sand"] + "]").length; }

    onHand["black elder leaves"] = $("#items-wrapper .item[data-item=" + ingredients["black elder leaves"] + "] .item_count").text();
    if (onHand["black elder leaves"] === "") { onHand["black elder leaves"] = $("#items-wrapper .item[data-item=" + ingredients["black elder leaves"] + "]").length; }

    onHand["black elderberries"] = $("#items-wrapper .item[data-item=" + ingredients["black elderberries"] + "] .item_count").text();
    if (onHand["black elderberries"] === "") { onHand["black elderberries"] = $("#items-wrapper .item[data-item=" + ingredients["black elderberries"] + "]").length; }

    onHand["yellow hellebore flower"] = $("#items-wrapper .item[data-item=" + ingredients["yellow hellebore flower"] + "] .item_count").text();
    if (onHand["yellow hellebore flower"] === "") { onHand["yellow hellebore flower"] = $("#items-wrapper .item[data-item=" + ingredients["yellow hellebore flower"] + "]").length; }

    onHand["upload potion"] = $("#items-wrapper .item[data-item=" + ingredients["upload potion"] + "] .item_count").text();
    if (onHand["upload potion"] === "") { onHand["upload potion"] = $("#items-wrapper .item[data-item=" + ingredients["upload potion"] + "]").length; }

    onHand["purple angelica flowers"] = $("#items-wrapper .item[data-item=" + ingredients["purple angelica flowers"] + "] .item_count").text();
    if (onHand["purple angelica flowers"] === "") { onHand["purple angelica flowers"] = $("#items-wrapper .item[data-item=" + ingredients["purple angelica flowers"] + "]").length; }

    onHand["garlic tincture"] = $("#items-wrapper .item[data-item=" + ingredients["garlic tincture"] + "] .item_count").text();
    if (onHand["garlic tincture"] === "") { onHand["garlic tincture"] = $("#items-wrapper .item[data-item=" + ingredients["garlic tincture"] + "]").length; }

    onHand["download-reduction potion"] = $("#items-wrapper .item[data-item=" + ingredients["download-reduction potion"] + "] .item_count").text();
    if (onHand["download-reduction potion"] === "") { onHand["download-reduction potion"] = $("#items-wrapper .item[data-item=" + ingredients["download-reduction potion"] + "]").length; }

    onHand["head of garlic"] = $("#items-wrapper .item[data-item=" + ingredients["head of garlic"] + "] .item_count").text();
    if (onHand["head of garlic"] === "") { onHand["head of garlic"] = $("#items-wrapper .item[data-item=" + ingredients["head of garlic"] + "]").length; }

    onHand["bronze alloy mix"] = $("#items-wrapper .item[data-item=" + ingredients["bronze alloy mix"] + "] .item_count").text();
    if (onHand["bronze alloy mix"] === "") { onHand["bronze alloy mix"] = $("#items-wrapper .item[data-item=" + ingredients["bronze alloy mix"] + "]").length; }

    onHand["clay"] = $("#items-wrapper .item[data-item=" + ingredients["clay"] + "] .item_count").text();
    if (onHand["clay"] === "") { onHand["clay"] = $("#items-wrapper .item[data-item=" + ingredients["clay"] + "]").length; }

    onHand["iron ore"] = $("#items-wrapper .item[data-item=" + ingredients["iron ore"] + "] .item_count").text();
    if (onHand["iron ore"] === "") { onHand["iron ore"] = $("#items-wrapper .item[data-item=" + ingredients["iron ore"] + "]").length; }

    onHand["lump of coal"] = $("#items-wrapper .item[data-item=" + ingredients["lump of coal"] + "] .item_count").text();
    if (onHand["lump of coal"] === "") { onHand["lump of coal"] = $("#items-wrapper .item[data-item=" + ingredients["lump of coal"] + "]").length; }

    onHand["iron bar"] = $("#items-wrapper .item[data-item=" + ingredients["iron bar"] + "] .item_count").text();
    if (onHand["iron bar"] === "") { onHand["iron bar"] = $("#items-wrapper .item[data-item=" + ingredients["iron bar"] + "]").length; }

    onHand["gold ore"] = $("#items-wrapper .item[data-item=" + ingredients["gold ore"] + "] .item_count").text();
    if (onHand["gold ore"] === "") { onHand["gold ore"] = $("#items-wrapper .item[data-item=" + ingredients["gold ore"] + "]").length; }

    onHand["adamantium ore"] = $("#items-wrapper .item[data-item=" + ingredients["adamantium ore"] + "] .item_count").text();
    if (onHand["adamantium ore"] === "") { onHand["adamantium ore"] = $("#items-wrapper .item[data-item=" + ingredients["adamantium ore"] + "]").length; }

    onHand["mithril ore"] = $("#items-wrapper .item[data-item=" + ingredients["mithril ore"] + "] .item_count").text();
    if (onHand["mithril ore"] === "") { onHand["mithril ore"] = $("#items-wrapper .item[data-item=" + ingredients["mithril ore"] + "]").length; }

    onHand["quartz dust"] = $("#items-wrapper .item[data-item=" + ingredients["quartz dust"] + "] .item_count").text();
    if (onHand["quartz dust"] === "") { onHand["quartz dust"] = $("#items-wrapper .item[data-item=" + ingredients["quartz dust"] + "]").length; }

    onHand["jade dust"] = $("#items-wrapper .item[data-item=" + ingredients["jade dust"] + "] .item_count").text();
    if (onHand["jade dust"] === "") { onHand["jade dust"] = $("#items-wrapper .item[data-item=" + ingredients["jade dust"] + "]").length; }

    onHand["amethyst dust"] = $("#items-wrapper .item[data-item=" + ingredients["amethyst dust"] + "] .item_count").text();
    if (onHand["amethyst dust"] === "") { onHand["amethyst dust"] = $("#items-wrapper .item[data-item=" + ingredients["amethyst dust"] + "]").length; }

    onHand["ruby-flecked wheat"] = $("#items-wrapper .item[data-item=" + ingredients["ruby-flecked wheat"] + "] .item_count").text();
    if (onHand["ruby-flecked wheat"] === "") { onHand["ruby-flecked wheat"] = $("#items-wrapper .item[data-item=" + ingredients["ruby-flecked wheat"] + "]").length; }

    onHand["emerald-flecked wheat"] = $("#items-wrapper .item[data-item=" + ingredients["emerald-flecked wheat"] + "] .item_count").text();
    if (onHand["emerald-flecked wheat"] === "") { onHand["emerald-flecked wheat"] = $("#items-wrapper .item[data-item=" + ingredients["emerald-flecked wheat"] + "]").length; }

    onHand["ruby-grained baguette"] = $("#items-wrapper .item[data-item=" + ingredients["ruby-grained baguette"] + "] .item_count").text();
    if (onHand["ruby-grained baguette"] === "") { onHand["ruby-grained baguette"] = $("#items-wrapper .item[data-item=" + ingredients["ruby-grained baguette"] + "]").length; }

    onHand["emerald-grained baguette"] = $("#items-wrapper .item[data-item=" + ingredients["emerald-grained baguette"] + "] .item_count").text();
    if (onHand["emerald-grained baguette"] === "") { onHand["emerald-grained baguette"] = $("#items-wrapper .item[data-item=" + ingredients["emerald-grained baguette"] + "]").length; }

    onHand["garlic ruby-baguette"] = $("#items-wrapper .item[data-item=" + ingredients["garlic ruby-baguette"] + "] .item_count").text();
    if (onHand["garlic ruby-baguette"] === "") { onHand["garlic ruby-baguette"] = $("#items-wrapper .item[data-item=" + ingredients["garlic ruby-baguette"] + "]").length; }

    onHand["garlic emerald-baguette"] = $("#items-wrapper .item[data-item=" + ingredients["garlic emerald-baguette"] + "] .item_count").text();
    if (onHand["garlic emerald-baguette"] === "") { onHand["garlic emerald-baguette"] = $("#items-wrapper .item[data-item=" + ingredients["garlic emerald-baguette"] + "]").length; }

    onHand["artisan emerald-baguette"] = $("#items-wrapper .item[data-item=" + ingredients["artisan emerald-baguette"] + "] .item_count").text();
    if (onHand["artisan emerald-baguette"] === "") { onHand["artisan emerald-baguette"] = $("#items-wrapper .item[data-item=" + ingredients["artisan emerald-baguette"] + "]").length; }

    onHand["emerald chip"] = $("#items-wrapper .item[data-item=" + ingredients["emerald chip"] + "] .item_count").text();
    if (onHand["emerald chip"] === "") { onHand["emerald chip"] = $("#items-wrapper .item[data-item=" + ingredients["emerald chip"] + "]").length; }

    onHand["quartz bar"] = $("#items-wrapper .item[data-item=" + ingredients["quartz bar"] + "] .item_count").text();
    if (onHand["quartz bar"] === "") { onHand["quartz bar"] = $("#items-wrapper .item[data-item=" + ingredients["quartz bar"] + "]").length; }

    onHand["carbon-crystalline quartz"] = $("#items-wrapper .item[data-item=" + ingredients["carbon-crystalline quartz"] + "] .item_count").text();
    if (onHand["carbon-crystalline quartz"] === "") { onHand["carbon-crystalline quartz"] = $("#items-wrapper .item[data-item=" + ingredients["carbon-crystalline quartz"] + "]").length; }

    onHand["ruby"] = $("#items-wrapper .item[data-item=" + ingredients["ruby"] + "] .item_count").text();
    if (onHand["ruby"] === "") { onHand["ruby"] = $("#items-wrapper .item[data-item=" + ingredients["ruby"] + "]").length; }

    onHand["sapphire"] = $("#items-wrapper .item[data-item=" + ingredients["sapphire"] + "] .item_count").text();
    if (onHand["sapphire"] === "") { onHand["sapphire"] = $("#items-wrapper .item[data-item=" + ingredients["sapphire"] + "]").length; }

    onHand["emerald"] = $("#items-wrapper .item[data-item=" + ingredients["emerald"] + "] .item_count").text();
    if (onHand["emerald"] === "") { onHand["emerald"] = $("#items-wrapper .item[data-item=" + ingredients["emerald"] + "]").length; }

    onHand["amethyst bar"] = $("#items-wrapper .item[data-item=" + ingredients["amethyst bar"] + "] .item_count").text();
    if (onHand["amethyst bar"] === "") { onHand["amethyst bar"] = $("#items-wrapper .item[data-item=" + ingredients["amethyst bar"] + "]").length; }

    onHand["flux"] = $("#items-wrapper .item[data-item=" + ingredients["flux"] + "] .item_count").text();
    if (onHand["flux"] === "") { onHand["flux"] = $("#items-wrapper .item[data-item=" + ingredients["flux"] + "]").length; }

    onHand["dwarven gem"] = $("#items-wrapper .item[data-item=" + ingredients["dwarven gem"] + "] .item_count").text();
    if (onHand["dwarven gem"] === "") { onHand["dwarven gem"] = $("#items-wrapper .item[data-item=" + ingredients["dwarven gem"] + "]").length; }
}

console.log(onHand);

var craftList = {};

function build_craft_list() {
    craftList = {};

    craftList["glass shards from test tube"] = {};
    craftList["glass shards from test tube"].ingredients = [ { name: "test tube", id: ingredients["test tube"], qty: 1, "on hand": onHand["test tube"] } ];
    craftList["glass shards from test tube"].icon = "http://test.test";
    craftList["glass shards from test tube"].available = onHand["test tube"];

    craftList["glass shards from sand"] = {};
    craftList["glass shards from sand"].ingredients = [ { name: "pile of sand", id: ingredients["pile of sand"], qty: 1, "on hand": onHand["pile of sand"] } ];
    craftList["glass shards from sand"].icon = "http://test.test";
    craftList["glass shards from sand"].available = onHand["pile of sand"];

    craftList["test tube"] = {};
    craftList["test tube"].ingredients = [ { name: "glass shards", id: ingredients["glass shards"], qty: 2, "on hand": onHand["glass shards"] } ];
    craftList["test tube"].icon = "http://test.test";
    craftList["test tube"].available = Math.floor(onHand["glass shards"] / 2);

    craftList["vial"] = {};
    craftList["vial"].ingredients = [ { name: "glass shards", id: ingredients["glass shards"], qty: 5, "on hand": onHand["glass shards"] } ];
    craftList["vial"].icon = "http://test.test";
    craftList["vial"].available = Math.floor(onHand["glass shards"] / 5);

    craftList["bowl"] = {};
    craftList["bowl"].ingredients = [ { name: "glass shards", id: ingredients["glass shards"], qty: 8, "on hand": onHand["glass shards"] } ];
    craftList["bowl"].icon = "http://test.test";
    craftList["bowl"].available = Math.floor(onHand["glass shards"] / 8);

    craftList["dust ore glassware (vial)"] = {};
    craftList["dust ore glassware (vial)"].ingredients = [
        { name: "pile of sand", id: ingredients["pile of sand"], qty: 1, "on hand": onHand["pile of sand"] },
        { name: "quartz dust", id: ingredients["quartz dust"], qty: 1, "on hand": onHand["quartz dust"] }
    ];
    craftList["dust ore glassware (vial)"].icon = "http://test.test";
    craftList["dust ore glassware (vial)"].available = Math.min(onHand["pile of sand"]
                                                                , onHand["quartz dust"]);

    craftList["dust ore glassware (bowl)"] = {};
    craftList["dust ore glassware (bowl)"].ingredients = [
        { name: "pile of sand", id: ingredients["pile of sand"], qty: 1, "on hand": onHand["pile of sand"] },
        { name: "jade dust", id: ingredients["jade dust"], qty: 1, "on hand": onHand["jade dust"] }
    ];
    craftList["dust ore glassware (bowl)"].icon = "http://test.test";
    craftList["dust ore glassware (bowl)"].available = Math.min(onHand["pile of sand"]
                                                                , onHand["jade dust"]);

    craftList["upload potion sampler"] = {};
    craftList["upload potion sampler"].ingredients = [
        { name: "test tube", id: ingredients["test tube"], qty: 1, "on hand": onHand["test tube"] },
        { name: "black elder leaves", id: ingredients["black elder leaves"], qty: 1, "on hand": onHand["black elder leaves"] },
        { name: "black elderberries", id: ingredients["black elderberries"], qty: 1, "on hand": onHand["black elderberries"] }
    ];
    craftList["upload potion sampler"].icon = "http://test.test";
    craftList["upload potion sampler"].available = Math.min(onHand["black elder leaves"]
                                                            , onHand["test tube"]
                                                            , onHand["black elderberries"]);

    craftList["small upload potion"] = {};
    craftList["small upload potion"].ingredients = [
        { name: "vial", id: ingredients["vial"], qty: 1, "on hand": onHand["vial"] },
        { name: "black elder leaves", id: ingredients["black elder leaves"], qty: 2, "on hand": onHand["black elder leaves"] },
        { name: "black elderberries", id: ingredients["black elderberries"], qty: 1, "on hand": onHand["black elderberries"] }
    ];
    craftList["small upload potion"].icon = "http://test.test";
    craftList["small upload potion"].available = Math.min(Math.floor(onHand["black elder leaves"] / 2)
                                                          , onHand["vial"]
                                                          , onHand["black elderberries"]);

    craftList["upload potion"] = {};
    craftList["upload potion"].ingredients = [
        { name: "vial", id: ingredients["vial"], qty: 1, "on hand": onHand["vial"] },
        { name: "black elder leaves", id: ingredients["black elder leaves"], qty: 5, "on hand": onHand["black elder leaves"] },
        { name: "black elderberries", id: ingredients["black elderberries"], qty: 1, "on hand": onHand["black elderberries"] }
    ];
    craftList["upload potion"].icon = "http://test.test";
    craftList["upload potion"].available = Math.min(Math.floor(onHand["black elder leaves"] / 5)
                                                    , onHand["black elderberries"]
                                                    , onHand["vial"]);

    craftList["large upload potion"] = {};
    craftList["large upload potion"].ingredients = [
        { name: "bowl", id: ingredients["bowl"], qty: 1, "on hand": onHand["bowl"] },
        { name: "upload potion", id: ingredients["upload potion"], qty: 2, "on hand": onHand["upload potion"] },
        { name: "yellow hellebore flower", id: ingredients["yellow hellebore flower"], qty: 1, "on hand": onHand["yellow hellebore flower"] }
    ];
    craftList["large upload potion"].icon = "http://test.test";
    craftList["large upload potion"].available = Math.min(Math.floor(onHand["upload potion"] / 2)
                                                          , onHand["bowl"]
                                                          , onHand["yellow hellebore flower"]);

    craftList["download-reduction potion sampler"] = {};
    craftList["download-reduction potion sampler"].ingredients = [
        { name: "test tube", id: ingredients["test tube"], qty: 1, "on hand": onHand["test tube"] },
        { name: "purple angelica flowers", id: ingredients["purple angelica flowers"], qty: 1, "on hand": onHand["purple angelica flowers"] },
        { name: "garlic tincture", id: ingredients["garlic tincture"], qty: 1, "on hand": onHand["garlic tincture"] }
    ];
    craftList["download-reduction potion sampler"].icon = "http://test.test";
    craftList["download-reduction potion sampler"].available = Math.min(onHand["test tube"]
                                                                        , onHand["purple angelica flowers"]
                                                                        , onHand["garlic tincture"]);

    craftList["small download-reduction potion"] = {};
    craftList["small download-reduction potion"].ingredients = [
        { name: "vial", id: ingredients["vial"], qty: 1, "on hand": onHand["vial"] },
        { name: "purple angelica flowers", id: ingredients["purple angelica flowers"], qty: 2, "on hand": onHand["purple angelica flowers"] },
        { name: "garlic tincture", id: ingredients["garlic tincture"], qty: 1, "on hand": onHand["garlic tincture"] }
    ];
    craftList["small download-reduction potion"].icon = "http://test.test";
    craftList["small download-reduction potion"].available = Math.min(Math.floor(onHand["purple angelica flowers"] / 2)
                                                                      , onHand["vial"]
                                                                      , onHand["garlic tincture"]);

    craftList["download-reduction potion"] = {};
    craftList["download-reduction potion"].ingredients = [
        { name: "vial", id: ingredients["vial"], qty: 1, "on hand": onHand["vial"] },
        { name: "purple angelica flowers", id: ingredients["purple angelica flowers"], qty: 5, "on hand": onHand["purple angelica flowers"] },
        { name: "garlic tincture", id: ingredients["garlic tincture"], qty: 1, "on hand": onHand["garlic tincture"] }
    ];
    craftList["download-reduction potion"].icon = "http://test.test";
    craftList["download-reduction potion"].available = Math.min(Math.floor(onHand["purple angelica flowers"] / 5)
                                                                , onHand["vial"]
                                                                , onHand["garlic tincture"]);

    craftList["large download-reduction potion"] = {};
    craftList["large download-reduction potion"].ingredients = [
        { name: "bowl", id: ingredients["bowl"], qty: 1, "on hand": onHand["bowl"] },
        { name: "download-reduction potion", id: ingredients["download-reduction potion"], qty: 2, "on hand": onHand["download-reduction potion"] },
        { name: "yellow hellebore flower", id: ingredients["yellow hellebore flower"], qty: 1, "on hand": onHand["yellow hellebore flower"] }
    ];
    craftList["large download-reduction potion"].icon = "http://test.test";
    craftList["large download-reduction potion"].available = Math.min(Math.floor(onHand["download-reduction potion"] / 2)
                                                                      , onHand["bowl"]
                                                                      , onHand["yellow hellebore flower"]);

    craftList["garlic tincture"] = {};
    craftList["garlic tincture"].ingredients = [
        { name: "test tube", id: ingredients["test tube"], qty: 1, "on hand": onHand["test tube"] },
        { name: "head of garlic", id: ingredients["head of garlic"], qty: 1, "on hand": onHand["head of garlic"] },
    ];
    craftList["garlic tincture"].icon = "http://test.test";
    craftList["garlic tincture"].available = Math.min(onHand["test tube"]
                                                      , onHand["head of garlic"]);

    craftList["small luck potion"] = {};
    craftList["small luck potion"].ingredients = [
        { name: "vial", id: ingredients["vial"], qty: 1, "on hand": onHand["vial"] },
        { name: "black elderberries", id: ingredients["black elderberries"], qty: 2, "on hand": onHand["black elderberries"] },
    ];
    craftList["small luck potion"].icon = "http://test.test";
    craftList["small luck potion"].available = Math.min(Math.floor(onHand["black elderberries"] / 2)
                                                        , onHand["vial"]);

    craftList["large luck potion"] = {};
    craftList["large luck potion"].ingredients = [
        { name: "bowl", id: ingredients["bowl"], qty: 1, "on hand": onHand["bowl"] },
        { name: "black elderberries", id: ingredients["black elderberries"], qty: 5, "on hand": onHand["black elderberries"] },
        { name: "yellow hellebore flower", id: ingredients["yellow hellebore flower"], qty: 1, "on hand": onHand["yellow hellebore flower"] }
    ];
    craftList["large luck potion"].icon = "http://test.test";
    craftList["large luck potion"].available = Math.min(Math.floor(onHand["black elderberries"] / 5)
                                                        , onHand["bowl"]
                                                        , onHand["yellow hellebore flower"]);

    craftList["ruby-grained baguette"] = {};
    craftList["ruby-grained baguette"].ingredients = [ { name: "ruby-flecked wheat", id: ingredients["ruby-flecked wheat"], qty: 2, "on hand": onHand["ruby-flecked wheat"] } ];
    craftList["ruby-grained baguette"].icon = "http://test.test";
    craftList["ruby-grained baguette"].available = Math.floor(onHand["ruby-flecked wheat"] / 2);

    craftList["emerald-grained baguette"] = {};
    craftList["emerald-grained baguette"].ingredients = [ { name: "emerald-flecked wheat", id: ingredients["emerald-flecked wheat"], qty: 2, "on hand": onHand["emerald-flecked wheat"] } ];
    craftList["emerald-grained baguette"].icon = "http://test.test";
    craftList["emerald-grained baguette"].available = Math.floor(onHand["emerald-flecked wheat"] / 2);

    craftList["garlic ruby-baguette"] = {};
    craftList["garlic ruby-baguette"].ingredients = [
        { name: "ruby-grained baguette", id: ingredients["ruby-grained baguette"], qty: 1, "on hand": onHand["ruby-grained baguette"] },
        { name: "head of garlic", id: ingredients["head of garlic"], qty: 2, "on hand": onHand["head of garlic"] },
    ];
    craftList["garlic ruby-baguette"].icon = "http://test.test";
    craftList["garlic ruby-baguette"].available = Math.min(Math.floor(onHand["head of garlic"] / 2)
                                                           , onHand["ruby-grained baguette"]);

    craftList["garlic emerald-baguette"] = {};
    craftList["garlic emerald-baguette"].ingredients = [
        { name: "emerald-grained baguette", id: ingredients["emerald-grained baguette"], qty: 1, "on hand": onHand["emerald-grained baguette"] },
        { name: "head of garlic", id: ingredients["head of garlic"], qty: 1, "on hand": onHand["head of garlic"] },
    ];
    craftList["garlic emerald-baguette"].icon = "http://test.test";
    craftList["garlic emerald-baguette"].available = Math.min(onHand["head of garlic"]
                                                              , onHand["emerald-grained baguette"]);

    craftList["artisan emerald-baguette"] = {};
    craftList["artisan emerald-baguette"].ingredients = [
        { name: "garlic emerald-baguette", id: ingredients["garlic emerald-baguette"], qty: 1, "on hand": onHand["garlic emerald-baguette"] },
        { name: "emerald chip", id: ingredients["emerald chip"], qty: 1, "on hand": onHand["emerald chip"] },
        { name: "yellow hellebore flower", id: ingredients["yellow hellebore flower"], qty: 1, "on hand": onHand["yellow hellebore flower"] },
    ];
    craftList["artisan emerald-baguette"].icon = "http://test.test";
    craftList["artisan emerald-baguette"].available = Math.min(onHand["garlic emerald-baguette"]
                                                               , onHand["emerald chip"]
                                                               , onHand["yellow hellebore flower"]);

    craftList["artisan ruby-baguette"] = {};
    craftList["artisan ruby-baguette"].ingredients = [
        { name: "garlic ruby-baguette", id: ingredients["garlic ruby-baguette"], qty: 1, "on hand": onHand["garlic ruby-baguette"] },
        { name: "yellow hellebore flower", id: ingredients["yellow hellebore flower"], qty: 2, "on hand": onHand["yellow hellebore flower"] },
    ];
    craftList["artisan ruby-baguette"].icon = "http://test.test";
    craftList["artisan ruby-baguette"].available = Math.min(Math.floor(onHand["yellow hellebore flower"] / 5)
                                                            , onHand["garlic ruby-baguette"]);

    craftList["gazellian emerald-baguette"] = {};
    craftList["gazellian emerald-baguette"].ingredients = [
        { name: "artisan emerald-baguette", id: ingredients["artisan emerald-baguette"], qty: 1, "on hand": onHand["artisan emerald-baguette"] },
        { name: "emerald chip", id: ingredients["emerald chip"], qty: 2, "on hand": onHand["emerald chip"] }
    ];
    craftList["gazellian emerald-baguette"].icon = "http://test.test";
    craftList["gazellian emerald-baguette"].available = Math.min(Math.floor(onHand["emerald chip"] / 2)
                                                                 , onHand["artisan emerald-baguette"]);

    craftList["impure bronze bar"] = {};
    craftList["impure bronze bar"].ingredients = [
        { name: "bronze alloy mix", id: ingredients["bronze alloy mix"], qty: 1, "on hand": onHand["bronze alloy mix"] },
        { name: "clay", id: ingredients["clay"], qty: 1, "on hand": onHand["clay"] },
    ];
    craftList["impure bronze bar"].icon = "http://test.test";
    craftList["impure bronze bar"].available = Math.min(onHand["bronze alloy mix"]
                                                        , onHand["clay"]);

    craftList["bronze bar"] = {};
    craftList["bronze bar"].ingredients = [ { name: "bronze alloy mix", id: ingredients["bronze alloy mix"], qty: 2, "on hand": onHand["bronze alloy mix"] } ];
    craftList["bronze bar"].icon = "http://test.test";
    craftList["bronze bar"].available = Math.floor(onHand["bronze alloy mix"] / 2);

    craftList["iron bar"] = {};
    craftList["iron bar"].ingredients = [ {name: "iron ore", id: ingredients["iron ore"], qty: 2, "on hand": onHand["iron ore"] } ];
    craftList["iron bar"].icon = "http://test.test";
    craftList["iron bar"].available = Math.floor(onHand["iron ore"] / 2);

    craftList["gold bar"] = {};
    craftList["gold bar"].ingredients = [ { name: "gold ore", id: ingredients["gold ore"], qty: 2, "on hand": onHand["gold ore"] } ];
    craftList["gold bar"].icon = "http://test.test";
    craftList["gold bar"].available = Math.floor(onHand["gold ore"] / 2);

    craftList["mithril bar"] = {};
    craftList["mithril bar"].ingredients = [ { name: "mithril ore", id: ingredients["mithril ore"], qty: 2, "on hand": onHand["mithril ore"] } ];
    craftList["mithril bar"].icon = "http://test.test";
    craftList["mithril bar"].available = Math.floor(onHand["mithril ore"] / 2);

    craftList["adamantium bar"] = {};
    craftList["adamantium bar"].ingredients = [ { name: "adamantium ore", id: ingredients["adamantium ore"], qty: 2, "on hand": onHand["adamantium ore"] } ];
    craftList["adamantium bar"].icon = "http://test.test";
    craftList["adamantium bar"].available = Math.floor(onHand["adamantium ore"] / 2);

    craftList["amethyst bar"] = {};
    craftList["amethyst bar"].ingredients = [ { name: "amethyst dust", id: ingredients["amethyst dust"], qty: 2, "on hand": onHand["amethyst dust"] } ];
    craftList["amethyst bar"].icon = "http://test.test";
    craftList["amethyst bar"].available = Math.floor(onHand["amethyst dust"] / 2);

    craftList["quartz bar"] = {};
    craftList["quartz bar"].ingredients = [ { name: "quartz dust", id: ingredients["quartz dust"], qty: 2, "on hand": onHand["quartz dust"] } ];
    craftList["quartz bar"].icon = "http://test.test";
    craftList["quartz bar"].available = Math.floor(onHand["quartz dust"] / 2);

    craftList["jade bar"] = {};
    craftList["jade bar"].ingredients = [ { name: "jade dust", id: ingredients["jade dust"], qty: 2, "on hand": onHand["jade dust"] } ];
    craftList["jade bar"].icon = "http://test.test";
    craftList["jade bar"].available = Math.floor(onHand["jade dust"] / 2);

    craftList["steel bar from iron ore"] = {};
    craftList["steel bar from iron ore"].ingredients = [
        { name: "iron ore", id: ingredients["iron ore"], qty: 2, "on hand": onHand["iron ore"] },
        { name: "lump of coal", id: ingredients["lump of coal"], qty: 1, "on hand": onHand["lump of coal"] },
    ];
    craftList["steel bar from iron ore"].icon = "http://test.test";
    craftList["steel bar from iron ore"].available = Math.min(Math.floor(onHand["iron ore"] / 2)
                                                              , onHand["lump of coal"]);

    craftList["steel bar from iron bar"] = {};
    craftList["steel bar from iron bar"].ingredients = [
        { name: "iron bar", id: ingredients["iron bar"], qty: 1, "on hand": onHand["iron bar"] },
        { name: "lump of coal", id: ingredients["lump of coal"], qty: 1, "on hand": onHand["lump of coal"] },
    ];
    craftList["steel bar from iron bar"].icon = "http://test.test";
    craftList["steel bar from iron bar"].available = Math.min(onHand["iron bar"]
                                                              , onHand["lump of coal"]);

    craftList["carbon-crystalline quartz gem"] = {};
    craftList["carbon-crystalline quartz gem"].ingredients = [
        { name: "quartz bar", id: ingredients["quartz bar"], qty: 1, "on hand": onHand["quartz bar"] },
        { name: "lump of coal", id: ingredients["lump of coal"], qty: 1, "on hand": onHand["lump of coal"] },
    ];
    craftList["carbon-crystalline quartz gem"].icon = "http://test.test";
    craftList["carbon-crystalline quartz gem"].available = Math.min(onHand["quartz bar"]
                                                                    , onHand["lump of coal"]);

    craftList["carbon-crystalline quartz necklace"] = {};
    craftList["carbon-crystalline quartz necklace"].ingredients = [
        { name: "carbon-crystalline quartz gem", id: ingredients["carbon-crystalline quartz gem"], qty: 1, "on hand": onHand["carbon-crystalline quartz"] },
        { name: "glass shards", id: ingredients["glass shards"], qty: 1, "on hand": onHand["glass shards"] },
    ];
    craftList["carbon-crystalline quartz necklace"].icon = "http://test.test";
    craftList["carbon-crystalline quartz necklace"].available = Math.min(onHand["carbon-crystalline quartz"]
                                                                         , onHand["glass shards"]);

    craftList["exquisite constellations of rubies"] = {};
    craftList["exquisite constellations of rubies"].ingredients = [
        { name: "amethyst bar", id: ingredients["amethyst bar"], qty: 2, "on hand": onHand["amethyst bar"] },
        { name: "ruby", id: ingredients["ruby"], qty: 4, "on hand": onHand["ruby"] },
    ];
    craftList["exquisite constellations of rubies"].icon = "http://test.test";
    craftList["exquisite constellations of rubies"].available = Math.min(Math.floor(onHand["amethyst bar"] / 2)
                                                                         , Math.floor(onHand["ruby"] / 4));

    craftList["exquisite constellations of sapphires"] = {};
    craftList["exquisite constellations of sapphires"].ingredients = [
        { name: "amethyst bar", id: ingredients["amethyst bar"], qty: 2, "on hand": onHand["amethyst bar"] },
        { name: "sapphire", id: ingredients["sapphire"], qty: 4, "on hand": onHand["sapphire"] },
    ];
    craftList["exquisite constellations of sapphires"].icon = "http://test.test";
    craftList["exquisite constellations of sapphires"].available = Math.min(Math.floor(onHand["amethyst bar"] / 2)
                                                                            , Math.floor(onHand["sapphire"] / 4));

    craftList["exquisite constellations of emeralds"] = {};
    craftList["exquisite constellations of emeralds"].ingredients = [
        { name: "amethyst bar", id: ingredients["amethyst bar"], qty: 2, "on hand": onHand["amethyst bar"] },
        { name: "emerald", id: ingredients["emerald"], qty: 4, "on hand": onHand["emerald"] },
    ];
    craftList["exquisite constellations of emeralds"].icon = "http://test.test";
    craftList["exquisite constellations of emeralds"].available = Math.min(Math.floor(onHand["amethyst bar"] / 2)
                                                                           , Math.floor(onHand["emerald"] / 4));

    craftList["melt dwarven gem"] = {};
    craftList["melt dwarven gem"].ingredients = [
        { name: "flux", id: ingredients["flux"], qty: 1, "on hand": onHand["flux"] },
        { name: "dwarven gem", id: ingredients["dwarven gem"], qty: 1, "on hand": onHand["dwarven gem"] },
    ];
    craftList["melt dwarven gem"].icon = "http://test.test";
    craftList["melt dwarven gem"].available = Math.min(onHand["flux"], onHand["dwarven gem"]);
}

function setIngredientSlot (ingredientId, slot) {
    // Check github for previous Drag and Drop functionality made with jQueryUI
    if (slot === "#slot_0") {
        slots[0] = ingredientId;
    }
    if (slot === "#slot_1") {
        slots[1] = ingredientId;
    }
    if (slot === "#slot_2") {
        slots[2] = ingredientId;
    }
    if (slot === "#slot_3") {
        slots[3] = ingredientId;
    }
    if (slot === "#slot_4") {
        slots[4] = ingredientId;
    }
    if (slot === "#slot_5") {
        slots[5] = ingredientId;
    }
    if (slot === "#slot_6") {
        slots[6] = ingredientId;
    }
    if (slot === "#slot_7") {
        slots[7] = ingredientId;
    }
    if (slot === "#slot_8") {
        slots[8] = ingredientId;
    }
};

function take_craft(craft_name) {
    $.get(urlBase.replace("CUSTOMRECIPE", getSlots()), function( data ) {
        if (data === "{}") {
            noty({type:'success', text: craft_name + ' was crafted successfully.'});
        } else {
            noty({type:'error', text: craft_name + ' failed.'});
            alert('Crafting failed. Response from server: ', data)
        }
    });
}


/* Crafts */
function craft_glass_shards_from_tube() {
    setIngredientSlot(ingredients["test tube"], "#slot_4");
}

function craft_glass_shards_from_sand() {
    setIngredientSlot(ingredients["pile of sand"], "#slot_4");
}

function craft_glass_test_tube() {
    setIngredientSlot(ingredients["glass shards"], "#slot_1");
    setIngredientSlot(ingredients["glass shards"], "#slot_4");
}

function craft_glass_vial() {
    setIngredientSlot(ingredients["glass shards"], "#slot_1");
    setIngredientSlot(ingredients["glass shards"], "#slot_3");
    setIngredientSlot(ingredients["glass shards"], "#slot_4");
    setIngredientSlot(ingredients["glass shards"], "#slot_6");
    setIngredientSlot(ingredients["glass shards"], "#slot_7");
}

function craft_glass_bowl() {
    setIngredientSlot(ingredients["glass shards"], "#slot_0");
    setIngredientSlot(ingredients["glass shards"], "#slot_1");
    setIngredientSlot(ingredients["glass shards"], "#slot_2");
    setIngredientSlot(ingredients["glass shards"], "#slot_3");
    setIngredientSlot(ingredients["glass shards"], "#slot_5");
    setIngredientSlot(ingredients["glass shards"], "#slot_6");
    setIngredientSlot(ingredients["glass shards"], "#slot_7");
    setIngredientSlot(ingredients["glass shards"], "#slot_8");
}

function craft_glass_dust_vial() {
    setIngredientSlot(ingredients["pile of sand"], "#slot_4");
    setIngredientSlot(ingredients["quartz dust"], "#slot_7")
    // if (setIngredientSlot === true) {} else {
    //     alert('Error 23. No Quartz Dust?');
    //     enable_quick_craft_buttons();
    //     clear_crafting_area();
    // }
}

function craft_glass_dust_bowl() {
    setIngredientSlot(ingredients["pile of sand"], "#slot_4");
    setIngredientSlot(ingredients["jade dust"], "#slot_7")
    // if (setIngredientSlot === true) {} else {
    //     alert('Error 24. No Jade Dust?');
    //     enable_quick_craft_buttons();
    //     clear_crafting_area();
    // }
}

function craft_upload_potion_sampler() {
    setIngredientSlot(ingredients["test tube"], "#slot_4");
    setIngredientSlot(ingredients["black elderberries"], "#slot_5");
    setIngredientSlot(ingredients["black elder leaves"], "#slot_2");
}

function craft_small_upload_potion() {
    setIngredientSlot(ingredients["vial"], "#slot_4");
    setIngredientSlot(ingredients["black elderberries"], "#slot_5");
    setIngredientSlot(ingredients["black elder leaves"], "#slot_2");
    setIngredientSlot(ingredients["black elder leaves"], "#slot_8");
}

function craft_upload_potion() {
    setIngredientSlot(ingredients["vial"], "#slot_4");
    setIngredientSlot(ingredients["black elderberries"], "#slot_5");
    setIngredientSlot(ingredients["black elder leaves"], "#slot_8");
    setIngredientSlot(ingredients["black elder leaves"], "#slot_6");
    setIngredientSlot(ingredients["black elder leaves"], "#slot_2");
    setIngredientSlot(ingredients["black elder leaves"], "#slot_3");
    setIngredientSlot(ingredients["black elder leaves"], "#slot_0");
}

function craft_large_upload_potion() {
    setIngredientSlot(ingredients["bowl"], "#slot_4");
    setIngredientSlot(ingredients["upload potion"], "#slot_5");
    setIngredientSlot(ingredients["upload potion"], "#slot_3");
    setIngredientSlot(ingredients["yellow hellebore flower"], "#slot_1");
}

function craft_download_potion_sampler() {
    setIngredientSlot(ingredients["test tube"], "#slot_4");
    setIngredientSlot(ingredients["purple angelica flowers"], "#slot_2");
    setIngredientSlot(ingredients["garlic tincture"], "#slot_5");
}

function craft_small_download_potion() {
    setIngredientSlot(ingredients["vial"], "#slot_4");
    setIngredientSlot(ingredients["garlic tincture"], "#slot_5");
    setIngredientSlot(ingredients["purple angelica flowers"], "#slot_8");
    setIngredientSlot(ingredients["purple angelica flowers"], "#slot_2");
}

function craft_download_potion() {
    setIngredientSlot(ingredients["vial"], "#slot_4");
    setIngredientSlot(ingredients["garlic tincture"], "#slot_5");
    setIngredientSlot(ingredients["purple angelica flowers"], "#slot_8");
    setIngredientSlot(ingredients["purple angelica flowers"], "#slot_6");
    setIngredientSlot(ingredients["purple angelica flowers"], "#slot_2");
    setIngredientSlot(ingredients["purple angelica flowers"], "#slot_3");
    setIngredientSlot(ingredients["purple angelica flowers"], "#slot_0");
}

function craft_large_download_potion() {
    setIngredientSlot(ingredients["bowl"], "#slot_4");
    setIngredientSlot(ingredients["download-reduction potion"], "#slot_5");
    setIngredientSlot(ingredients["download-reduction potion"], "#slot_3");
    setIngredientSlot(ingredients["yellow hellebore flower"], "#slot_1");
}

function craft_garlic_tincture() {
    setIngredientSlot(ingredients["test tube"], "#slot_4");
    setIngredientSlot(ingredients["head of garlic"], "#slot_5");
}

function craft_impure_bronze_bar() {
    setIngredientSlot(ingredients["bronze alloy mix"], "#slot_0");
    setIngredientSlot(ingredients["clay"], "#slot_1");
}

function craft_bronze_bar() {
    setIngredientSlot(ingredients["bronze alloy mix"], "#slot_0");
    setIngredientSlot(ingredients["bronze alloy mix"], "#slot_1");
}

function craft_iron_bar() {
    setIngredientSlot(ingredients["iron ore"], "#slot_0");
    setIngredientSlot(ingredients["iron ore"], "#slot_1");
}

function craft_steel_bar() {
    setIngredientSlot(ingredients["iron ore"], "#slot_0");
    setIngredientSlot(ingredients["iron ore"], "#slot_1");
    setIngredientSlot(ingredients["lump of coal"], "#slot_4");
}

function craft_steel_bar_from_iron_bar() {
    setIngredientSlot(ingredients["iron bar"], "#slot_1");
    setIngredientSlot(ingredients["lump of coal"], "#slot_4");
}

function craft_gold_bar() {
    setIngredientSlot(ingredients["gold ore"], "#slot_0");
    setIngredientSlot(ingredients["gold ore"], "#slot_1");
}

function craft_mithril_bar() {
    setIngredientSlot(ingredients["mithril ore"], "#slot_0");
    setIngredientSlot(ingredients["mithril ore"], "#slot_1");
}

function craft_adamantium_bar() {
    setIngredientSlot(ingredients["adamantium ore"], "#slot_0");
    setIngredientSlot(ingredients["adamantium ore"], "#slot_1");
}

function craft_quartz_bar() {
    setIngredientSlot(ingredients["quartz dust"], "#slot_0");
    setIngredientSlot(ingredients["quartz dust"], "#slot_1");
}

function craft_jade_bar() {
    setIngredientSlot(ingredients["jade dust"], "#slot_0");
    setIngredientSlot(ingredients["jade dust"], "#slot_1");
}

function craft_amethyst_bar() {
    setIngredientSlot(ingredients["amethyst dust"], "#slot_0");
    setIngredientSlot(ingredients["amethyst dust"], "#slot_1");
}

function craft_small_luck_potion() {
    setIngredientSlot(ingredients["vial"], "#slot_3");
    setIngredientSlot(ingredients["black elderberries"], "#slot_4");
    setIngredientSlot(ingredients["black elderberries"], "#slot_5");
}

function craft_large_luck_potion() {
    setIngredientSlot(ingredients["bowl"], "#slot_4");
    setIngredientSlot(ingredients["black elderberries"], "#slot_0");
    setIngredientSlot(ingredients["black elderberries"], "#slot_1");
    setIngredientSlot(ingredients["black elderberries"], "#slot_2");
    setIngredientSlot(ingredients["black elderberries"], "#slot_3");
    setIngredientSlot(ingredients["black elderberries"], "#slot_5");
    setIngredientSlot(ingredients["yellow hellebore flower"], "#slot_7");
}

function craft_ruby_grained_baguette() {
    setIngredientSlot(ingredients["ruby-flecked wheat"], "#slot_4");
    setIngredientSlot(ingredients["ruby-flecked wheat"], "#slot_5");
}

function craft_emerald_grained_baguette() {
    setIngredientSlot(ingredients["emerald-flecked wheat"], "#slot_4");
    setIngredientSlot(ingredients["emerald-flecked wheat"], "#slot_5");
}

function craft_garlic_ruby_baguette() {
    setIngredientSlot(ingredients["ruby-grained baguette"], "#slot_4");
    setIngredientSlot(ingredients["head of garlic"], "#slot_3");
    setIngredientSlot(ingredients["head of garlic"], "#slot_5");
}

function craft_garlic_emerald_baguette() {
    setIngredientSlot(ingredients["emerald-grained baguette"], "#slot_4");
    setIngredientSlot(ingredients["head of garlic"], "#slot_5");
}

function craft_artisan_ruby_baguette() {
    setIngredientSlot(ingredients["garlic ruby-baguette"], "#slot_3");
    setIngredientSlot(ingredients["yellow hellebore flower"], "#slot_4");
    setIngredientSlot(ingredients["yellow hellebore flower"], "#slot_5");
}

function craft_artisan_emerald_baguette() {
    setIngredientSlot(ingredients["garlic emerald-baguette"], "#slot_3");
    setIngredientSlot(ingredients["emerald chip"], "#slot_4");
    setIngredientSlot(ingredients["yellow hellebore flower"], "#slot_5");
}

function craft_gazellian_emerald_baguette() {
    setIngredientSlot(ingredients["artisan emerald-baguette"], "#slot_3");
    setIngredientSlot(ingredients["emerald chip"], "#slot_4");
    setIngredientSlot(ingredients["emerald chip"], "#slot_5");
}

function craft_carbon_crystalline_quartz_gem() {
    setIngredientSlot(ingredients["carbon-crystalline quartz"], "#slot_4");
    setIngredientSlot(ingredients["glass shards"], "#slot_1");
}

function craft_carbon_crystalline_quartz_necklace() {
    setIngredientSlot(ingredients["quartz bar"], "#slot_4");
    setIngredientSlot(ingredients["lump of coal"], "#slot_5");
}

function craft_exquisite_constellation_emeralds() {
    setIngredientSlot(ingredients["emerald"], "#slot_3");
    setIngredientSlot(ingredients["emerald"], "#slot_5");
    setIngredientSlot(ingredients["emerald"], "#slot_6");
    setIngredientSlot(ingredients["emerald"], "#slot_8");
    setIngredientSlot(ingredients["amethyst bar"], "#slot_4");
    setIngredientSlot(ingredients["amethyst bar"], "#slot_7");
}

function craft_exquisite_constellation_rubies() {
    setIngredientSlot(ingredients["ruby"], "#slot_3");
    setIngredientSlot(ingredients["ruby"], "#slot_5");
    setIngredientSlot(ingredients["ruby"], "#slot_6");
    setIngredientSlot(ingredients["ruby"], "#slot_8");
    setIngredientSlot(ingredients["amethyst bar"], "#slot_4");
    setIngredientSlot(ingredients["amethyst bar"], "#slot_7");
}

function craft_exquisite_constellation_sapphires() {
    setIngredientSlot(ingredients["sapphire"], "#slot_3");
    setIngredientSlot(ingredients["sapphire"], "#slot_5");
    setIngredientSlot(ingredients["sapphire"], "#slot_6");
    setIngredientSlot(ingredients["sapphire"], "#slot_8");
    setIngredientSlot(ingredients["amethyst bar"], "#slot_4");
    setIngredientSlot(ingredients["amethyst bar"], "#slot_7");
}

function melt_dwarven_gem() {
    setIngredientSlot(ingredients["flux"], "#slot_7");
    setIngredientSlot(ingredients["dwarven gem"], "#slot_4");
}
/* End Crafts */

function do_craft(craft_name) {
    console.log('crafting', craft_name);

    /* Glass */
    if (craft_name === "glass shards from test tube") {
        craft_glass_shards_from_tube();
    } else if (craft_name === "glass shards from sand") {
        craft_glass_shards_from_sand();
    }
    else if (craft_name === "test tube") {
        craft_glass_test_tube();
    }
    else if (craft_name === "vial") {
        craft_glass_vial();
    }
    else if (craft_name === "bowl") {
        craft_glass_bowl();
    }
    else if (craft_name === "dust ore glassware (vial)") {
        craft_glass_dust_vial();
    }
    else if (craft_name === "dust ore glassware (bowl)") {
        craft_glass_dust_bowl();
    }

    /* Upload potions */
    else if (craft_name === "upload potion sampler") {
        craft_upload_potion_sampler();
    }
    else if (craft_name === "small upload potion") {
        craft_small_upload_potion();
    }
    else if (craft_name === "upload potion") {
        craft_upload_potion();
    }
    else if (craft_name === "large upload potion") {
        craft_large_upload_potion();
    }

    /* Download potions */
    else if (craft_name === "download-reduction potion sampler") {
        craft_download_potion_sampler();
    }
    else if (craft_name === "small download-reduction potion") {
        craft_small_download_potion();
    }
    else if (craft_name === "download-reduction potion") {
        craft_download_potion();
    }
    else if (craft_name === "large download-reduction potion") {
        craft_large_download_potion();
    }
    else if (craft_name === "garlic tincture") {
        craft_garlic_tincture();
    }

    /* Metal bars */
    else if (craft_name === "impure bronze bar") {
        craft_impure_bronze_bar();
    }
    else if (craft_name === "bronze bar") {
        craft_bronze_bar();
    }
    else if (craft_name === "iron bar") {
        craft_iron_bar();
    }
    else if (craft_name === "steel bar from iron ore") {
        craft_steel_bar();
    }
    else if (craft_name === "steel bar from iron bar") {
        craft_steel_bar_from_iron_bar();
    }
    else if (craft_name === "gold bar") {
        craft_gold_bar();
    }
    else if (craft_name === "mithril bar") {
        craft_mithril_bar();
    }
    else if (craft_name === "adamantium bar") {
        craft_adamantium_bar();
    }
    else if (craft_name === "quartz bar") {
        craft_quartz_bar();
    }
    else if (craft_name === "jade bar") {
        craft_jade_bar();
    }
    else if (craft_name === "amethyst bar") {
        craft_amethyst_bar();
    }

    /* Luck potions */
    else if (craft_name === "small luck potion") {
        craft_small_luck_potion();
    }
    else if (craft_name === "large luck potion") {
        craft_large_luck_potion();
    }

    /* Food */
    else if (craft_name === "ruby-grained baguette") {
        craft_ruby_grained_baguette();
    }
    else if (craft_name === "emerald-grained baguette") {
        craft_emerald_grained_baguette();
    }
    else if (craft_name === "garlic ruby-baguette") {
        craft_garlic_ruby_baguette();
    }
    else if (craft_name === "garlic emerald-baguette") {
        craft_garlic_emerald_baguette();
    }
    else if (craft_name === "artisan ruby-baguette") {
        craft_artisan_ruby_baguette();
    }
    else if (craft_name === "artisan emerald-baguette") {
        craft_artisan_emerald_baguette();
    }
    else if (craft_name === "gazellian emerald-baguette") {
        craft_gazellian_emerald_baguette();
    }

    /* Jewelry */
    else if (craft_name === "carbon-crystalline quartz gem") {
        craft_carbon_crystalline_quartz_gem();
    }
    else if (craft_name === "carbon-crystalline quartz necklace") {
        craft_carbon_crystalline_quartz_necklace();
    }
    else if (craft_name === "exquisite constellation emeralds") {
        craft_exquisite_constellation_emeralds();
    }
    else if (craft_name === "exquisite constellation sapphires") {
        craft_exquisite_constellation_sapphires();
    }
    else if (craft_name === "exquisite constellation rubies") {
        craft_exquisite_constellation_rubies();
    }

    /* Misc/Recast */
    else if (craft_name === "melt dwarven gem") {
        melt_dwarven_gem();
    }

    enable_quick_craft_buttons();
}

function disable_quick_craft_buttons() {
    $("#crafting-submenu button").prop("disabled",true);
    $("#crafting-submenu button").addClass("disabled");
}

function enable_quick_craft_buttons() {
    setTimeout(function() {
        $("#crafting-submenu button").prop("disabled",false);
        $("#crafting-submenu button").removeClass("disabled");

        disable_craft_button = false;

        next_button_lockout_delay = BUTTON_LOCKOUT_DELAY;
    }, next_button_lockout_delay);
}

var disable_craft_button = false;

function open_crafting_submenu(craft_name) {
    //clear_crafting_area();
    close_crafting_submenu();
    build_on_hand();
    build_craft_list();

// I'm having trouble gettinga close button working right now, maybe later
//     $("#current_craft_box").append('<div id="close-submenu" style="float:left">'
//                                    + '<span style="text-decoration: underline" onClick=document.getElementById("crafting-submenu").outerHTML = ""; '
//                                    + 'id="close_crafting_submenu">X</span></div>');

    $("#current_craft_box").append('<div id="crafting-submenu" style="text-align:center"></div>');
    $("#crafting-submenu").append('<p>' + titleCase(craft_name) + '</p>');

    var currentCraft = craftList[craft_name];

    console.log(currentCraft);

    $("#crafting-submenu").append('<p> Ingredients: </p>');

    currentCraft.ingredients.map(ingredient => {
        $("#crafting-submenu").append('<p style="display: inline">'
                                      + titleCase(ingredient.name) + ': ' + ingredient.qty + '/' + ingredient["on hand"] + '</p>');
        $("#crafting-submenu").append('<br />');
    });

    if (currentCraft.available > 0) {
        $("#crafting-submenu").append('<select id="craft_number_select">');

        var i;
        for (i = 1; i <= currentCraft.available; i++) {
            $("#craft_number_select").append("<option value='" + i + "'>" + i + "</option>");
        }

        $("#crafting-submenu").append('</select>');

        var craftButton = $("<button>");
        craftButton.on("click", function() {
            var craftNumber = $("#craft_number_select").children("option:selected").val();

            disable_craft_button = true;

            next_button_lockout_delay = BUTTON_LOCKOUT_DELAY * Number(craftNumber);

            disable_quick_craft_buttons();
            enable_quick_craft_buttons();

            (async function loop() {
                for (let i = 0; i < craftNumber; i++) {
                    await new Promise(resolve => setTimeout(function() {
                        console.log('craft');
                        do_craft(craft_name);
                        take_craft(craft_name);
                        resolve();
                    }, CRAFT_TIME));
                }
            })();
        });

        craftButton.html('Craft');
        craftButton.prop('style', 'margin-left: 5px');

        $("#crafting-submenu").append(craftButton);

        if (disable_craft_button === true) {
            disable_quick_craft_buttons();
        }
    }
}

function close_crafting_submenu() {
    $("#crafting-submenu").remove();
}

(function() {
    'use strict';

    $("#crafting_recipes").before(
        '<div id="quick-crafter" style="border: 1px solid #fff;margin-bottom: 17px;display: block;clear: both;position:relative;background-color:rgba(0,0,0,.7);padding:5px;"></div>');

//     $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: black;" id="test_filter_by_id">Test</button>');

//     var test = false;
//     $("#test_filter_by_id").click(function() {
//         if (test === false) {
//             clear_crafting_area();
//
//                 console.log(getElement(ingredients["test tube"]));
//                 setIngredientSlot(getElement(ingredients["test tube"]), "#slot_4");
//             }, 1500);
//             test = true;
//         } else {
//             grab_result();
//             clear_crafting_area();
//             test = false;
//         }
//     });

    $("#quick-crafter").append('<div id="current_craft_box"></div>');
    $("#quick-crafter").append('<p>Having trouble? Try refreshing if it seems stuck. Turn off this script before manual crafting for a better experience.');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: red;" id="clear_button" class="quick_craft_button">Clear</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: white; color: black;" id="shards_tube" class="quick_craft_button">Glass Shards From Tube</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: white; color: black;" id="shards_sand" class="quick_craft_button glass">Glass Shards From Sand</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: white; color: black;" id="test_tube" class="quick_craft_button glass">Test Tube</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: white; color: black;" id="vial" class="quick_craft_button glass">Vial</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: white; color: black;" id="bowl" class="quick_craft_button glass">Bowl</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: white; color: black;" id="dust_vial" class="quick_craft_button glass">Dust Ore Glassware (Vial)</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: white; color: black;" id="dust_bowl" class="quick_craft_button glass">Dust Ore Glassware (Bowl)</button>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: green;" id="upload_potion_sampler" class="quick_craft_button basic_stat">Upload Potion Sampler</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: green;" id="small_upload_potion" class="quick_craft_button basic_stat">Small Upload Potion</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: green;" id="upload_potion" class="quick_craft_button basic_stat">Upload Potion</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: green;" id="large_upload_potion" class="quick_craft_button basic_stat">Large Upload Potion</button>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: brown;" id="download_potion_sampler" class="quick_craft_button basic_stat">Download-Reduction Potion Sampler</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: brown;" id="small_download_potion" class="quick_craft_button basic_stat">Small Download-Reduction Potion</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: brown;" id="download_potion" class="quick_craft_button basic_stat">Download-Reduction Potion</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: brown;" id="large_download_potion" class="quick_craft_button basic_stat">Large Download-Reduction Potion</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: brown;" id="garlic_tincture" class="quick_craft_button basic_stat">Garlic Tincture</button>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: purple;" id="impure_bronze_bar" class="quick_craft_button metal_bar">Impure Bronze Bar</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: purple;" id="bronze_bar" class="quick_craft_button metal_bar">Bronze Bar</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: purple;" id="iron_bar" class="quick_craft_button metal_bar">Iron Bar</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: purple;" id="steel_bar" class="quick_craft_button metal_bar">Steel Bar from Iron Ore</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: purple;" id="steel_bar_from_iron_bar" class="quick_craft_button metal_bar">Steel Bar from Iron Bar</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: purple;" id="gold_bar" class="quick_craft_button metal_bar">Gold Bar</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: purple;" id="mithril_bar" class="quick_craft_button metal_bar">Mithril Bar</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: purple;" id="adamantium_bar" class="quick_craft_button metal_bar">Adamantium Bar</button>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: #9966cc;" id="quartz_bar" class="quick_craft_button metal_bar">Quartz Bar</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: #9966cc;" id="jade_bar" class="quick_craft_button metal_bar">Jade Bar</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: #9966cc;" id="amethyst_bar" class="quick_craft_button metal_bar">Amethyst Bar</button>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: blue;" id="small_luck_potion" class="quick_craft_button luck">Small Luck Potion</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: blue;" id="large_luck_potion" class="quick_craft_button luck">Large Luck Potion</button>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: wheat;color: black;" id="ruby_grained_baguette" class="quick_craft_button food">Ruby-Grained Baguette</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: wheat;color: black;" id="emerald_grained_baguette" class="quick_craft_button food">Emerald-Grained Baguette</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: wheat;color: black;" id="garlic_ruby_baguette" class="quick_craft_button food">Garlic Ruby-Baguette</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: wheat;color: black;" id="garlic_emerald_baguette" class="quick_craft_button food">Garlic Emerald-Baguette</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: wheat;color: black;" id="artisan_ruby_baguette" class="quick_craft_button food">Artisan Ruby-Baguette</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: wheat;color: black;" id="artisan_emerald_baguette" class="quick_craft_button food">Artisan Emerald-Baguette</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: wheat;color: black;" id="gazellian_emerald_baguette" class="quick_craft_button food">Gazellian Emerald-Baguette</button>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: deeppink;" id="carbon_crystalline_quartz_gem" class="quick_craft_button jewelry">Carbon-Crystalline Quartz Gem</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: deeppink;" id="carbon_crystalline_quartz_necklace" class="quick_craft_button jewelry">Carbon-Crystalline Quartz Necklace</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: deeppink;" id="exquisite_constellation_emeralds" class="quick_craft_button jewelry">Exquisite Constellation of Emeralds</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: deeppink;" id="exquisite_constellation_rubies" class="quick_craft_button jewelry">Exquisite Constellation of Rubies</button>');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: deeppink;" id="exquisite_constellation_sapphires" class="quick_craft_button jewelry">Exquisite Constellation of Sapphires</button>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<button style="margin-top:3px;margin-right:5px;background-color: gray;" id="melt_dwarven_gem" class="quick_craft_button recast">Melt Dwarven gem</button>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<br />');

    var hasFoodBook = $("#crafting_recipes h3:contains('Food Cooking Recipes')").length ? true : false;
    var hasStatPotionBook = $("#crafting_recipes h3:contains('Basic Stat Potion Crafting Recipes')").length ? true : false;
    var hasMetalBarBook = $("#crafting_recipes h3:contains('Metal Bar Crafting Recipes')").length ? true : false;
    var hasJewelryBook = $("#crafting_recipes h3:contains('Jewelry Crafting Recipes')").length ? true : false;
    var hasGlassBook = $("#crafting_recipes h3:contains('Basic Stat Potion Crafting Recipes')").length ? true : false;
    var hasLuckBook = $("#crafting_recipes h3:contains('Luck Potion Crafting Recipes')").length ? true : false;
    var hasDebugBook = $("#crafting_recipes h3:contains('A fake book for testing')").length ? true : false;
    var hasRecastBook = $("#crafting_recipes h3:contains('Recast Blacksmith Crafting Book')").length ? true : false;

    $("#quick-crafter").append('<span>Recipes will appear if you have one or more of the following books:</span>');
    $("#quick-crafter").append('<br />');
    $("#quick-crafter").append('<span><b>Glass Book:</span> ' + hasGlassBook + ' | <b>Food Book:</b> ' + hasFoodBook +
                               ' | <b>Basic Stat Potion Book:</b> ' + hasStatPotionBook + ' | <b>Metal Bar Book:</b> '
                               + hasMetalBarBook + ' | <b>Jewelry Book:</b> ' + hasJewelryBook + ' | <b>Luck Book:</b> ' + hasLuckBook
                               + ' | <b>Recast Blacksmith Book:</b> ' + hasRecastBook + '</p>');

     $("#quick-crafter").append('<p style="float:right;margin-top:-20px;margin-right:5px;">Quick Crafter by <a href="/user.php?id=58819">KingKrab23</a> v<a href="https://github.com/KingKrab23/Quick_Craft/raw/master/GGn%20Quick%20Crafting.user.js">' + VERSION +'</a></p>');
    if (hasFoodBook === false) {
        $('.food').remove();
    }

    if (hasStatPotionBook === false) {
        $('.basic_stat').remove();
    }

    if (hasLuckBook === false) {
        $('.luck').remove();
    }

    if (hasJewelryBook === false) {
        $('.jewelry').remove();
    }

    if (hasMetalBarBook === false) {
        $('.metal_bar').remove();
    }

    if (hasGlassBook === false) {
        $('.glass').remove();
    }

    if (hasRecastBook === false) {
        $('.recast').remove();
    }

    //console.log(ingredients);
    build_on_hand();
    build_craft_list();

    $("#clear_button").click(function() {
        next_button_lockout_delay = 300;
        disable_quick_craft_buttons();

        clear_crafting_area();

        enable_quick_craft_buttons();
    });

    $("#melt_dwarven_gem").click(function() {
        open_crafting_submenu("melt dwarven gem");
    });

    $("#shards_tube").click(function() {
        open_crafting_submenu("glass shards from test tube");
    });
    $("#shards_sand").click(function() {
        open_crafting_submenu("glass shards from sand");
    });
    $("#test_tube").click(function() {
        open_crafting_submenu("test tube");
    });
    $("#vial").click(function() {
        open_crafting_submenu("vial")
    });
    $("#bowl").click(function() {
        open_crafting_submenu("bowl");
    });
    $("#dust_vial").click(function() {
        open_crafting_submenu("dust ore glassware (vial)");
    });
    $("#dust_bowl").click(function() {
        open_crafting_submenu("dust ore glassware (bowl)");
    });

    $("#upload_potion_sampler").click(function() {
        open_crafting_submenu("upload potion sampler");
    });
    $("#small_upload_potion").click(function() {
        open_crafting_submenu("small upload potion");
    });
    $("#upload_potion").click(function() {
        open_crafting_submenu("upload potion");
    });
    $("#large_upload_potion").click(function() {
        open_crafting_submenu("large upload potion");
    });

    $("#download_potion_sampler").click(function() {
        open_crafting_submenu("download-reduction potion sampler");
    });
    $("#small_download_potion").click(function() {
        open_crafting_submenu("small download-reduction potion");
    });
    $("#download_potion").click(function() {
        open_crafting_submenu("download-reduction potion");
    });
    $("#large_download_potion").click(function() {
        open_crafting_submenu("large download-reduction potion");
    });

    $("#garlic_tincture").click(function() {
        open_crafting_submenu("garlic tincture");
    });

    $("#impure_bronze_bar").click(function() {
        open_crafting_submenu("impure bronze bar");
    });
    $("#bronze_bar").click(function() {
        open_crafting_submenu("bronze bar");
    });
    $("#iron_bar").click(function() {
        open_crafting_submenu("iron bar");
    });
    $("#steel_bar").click(function() {
        open_crafting_submenu("steel bar from iron ore");
    });
    $("#steel_bar_from_iron_bar").click(function() {
        open_crafting_submenu("steel bar from iron bar");
    });
    $("#gold_bar").click(function() {
        open_crafting_submenu("gold bar");
    });
    $("#mithril_bar").click(function() {
        open_crafting_submenu("mithril bar");
    });
    $("#adamantium_bar").click(function() {
        open_crafting_submenu("adamantium bar");
    });
    $("#quartz_bar").click(function() {
        open_crafting_submenu("quartz bar");
    });
    $("#jade_bar").click(function() {
        open_crafting_submenu("jade bar");
    });
    $("#amethyst_bar").click(function() {
        open_crafting_submenu("amethyst bar");
    });

    $("#small_luck_potion").click(function() {
        open_crafting_submenu("small luck potion");
    });
    $("#large_luck_potion").click(function() {
        open_crafting_submenu("large luck potion");
    });

    $("#ruby_grained_baguette").click(function() {
        open_crafting_submenu("ruby-grained baguette");
    });
    $("#emerald_grained_baguette").click(function() {
        open_crafting_submenu("emerald-grained baguette");
    });
    $("#garlic_ruby_baguette").click(function() {
        open_crafting_submenu("garlic ruby-baguette");
    });
    $("#garlic_emerald_baguette").click(function() {
        open_crafting_submenu("garlic emerald-baguette");
    });
    $("#artisan_ruby_baguette").click(function() {
        open_crafting_submenu("artisan ruby-baguette");
    });
    $("#artisan_emerald_baguette").click(function() {
        open_crafting_submenu("artisan emerald-baguette");
    });
    $("#gazellian_emerald_baguette").click(function() {
        open_crafting_submenu("gazellian emerald-baguette");
    });

    $("#carbon_crystalline_quartz_gem").click(function() {
        open_crafting_submenu("carbon-crystalline quartz gem");
    });
    $("#carbon_crystalline_quartz_necklace").click(function() {
        open_crafting_submenu("carbon-crystalline quartz necklace");
    });
    $("#exquisite_constellation_emeralds").click(function() {
        open_crafting_submenu("exquisite constellations of emeralds");
    });
    $("#exquisite_constellation_sapphires").click(function() {
        open_crafting_submenu("exquisite constellations of sapphires");
    });
    $("#exquisite_constellation_rubies").click(function() {
        open_crafting_submenu("exquisite constellations of rubies");
    });

})();
