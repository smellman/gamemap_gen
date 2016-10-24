var page = require('webpage').create(),
    system = require('system'),
    fs = require('fs');

var basezoom = 13;
var minzoom = 14;
var maxzoom = 15;
var tile_size = 512;

var get_scale = function(zoom) {
    return Math.pow(2, zoom - basezoom);
};

var build_tile = function(obj, size, zoom, output_dir) {
    var scale = get_scale(zoom);
    obj.zoomFactor = scale;
    var start_column = 0;
    var row = 0;
    var column = 0;
    var to_x = size.width * scale;
    var to_y = size.height * scale;
    var start_x = 0;
    var start_y = 0;

    var rect = { top: start_y, left: start_x, width: tile_size, height: tile_size };
    while (true) {
        if (rect.left > to_x) {
            rect.left = start_x;
            rect.top = rect.top + rect.height;
            column = start_column;
            row = row + 1;
        }
        if (rect.top > to_y) {
            break;
        }
        var filename = output_dir + fs.separator + zoom + fs.separator + column + "_" + row + ".png";
        //console.log(filename);
        page.clipRect = rect;
        page.render(filename);
        rect.left = rect.left + rect.width;
        column = column + 1;
    }
};

var run = function(svgfile, output_dir) {
    page.open(svgfile, function(status) {
        if (status !== 'success') {
            console.log('Unable to load the address: ' + svgfile);
            phantom.exit();
        } else {
            window.setTimeout(function() {
                var baseVal = page.evaluate(function() {
                    return document.rootElement.viewBox.baseVal;
                });
                var size = {
                    "width": baseVal.width,
                    "height": baseVal.height
                };
                for (var zoom = minzoom; zoom <= maxzoom; zoom++) {
                    build_tile(page, size, zoom, output_dir);
                }
                phantom.exit();
            }, 200);
        }
    });
};

var make_directory = function(dir_path) {
    if (!fs.isDirectory(dir_path)) {
        if (!fs.makeDirectory(dir_path)) {
            console.log("can't makedirectory: " + dir_path);
            phantom.exit();
        }
    }
};

var make_directories = function(output_dir) {
    make_directory(output_dir);
    for (var zoom = minzoom; zoom <= maxzoom; zoom++) {
        var dir = output_dir + fs.separator + zoom;
        make_directory(dir);
    }
};

if (system.args.length < 3) {
    console.log('Usage: ' + system.args[0] + ' input_file output_dir');
    phantom.exit(1);
} else {
    var svgfile = system.args[1];
    var output_dir = system.args[2];

    make_directories(output_dir);
    run(svgfile, output_dir);
}
