/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:validatr.jquery.json>',
        meta: {
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        concat: {
            dist: {
                src: ['<banner:meta.banner>', '<file_strip_banner:src/js/<%= pkg.name %>.js>'],
                dest: 'dist/src/<%= pkg.name %>.js'
            },
            distcss: {
                src: ['<banner:meta.banner>', '<file_strip_banner:src/css/<%= pkg.name %>.css>'],
                dest: 'dist/src/<%= pkg.name %>.css'
            },
            mincss: {
                src: ['<banner:meta.banner>', '<file_strip_banner:dist/min/<%= pkg.name %>.min.css>'],
                dest: 'dist/min/<%= pkg.name %>.min.css'
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/min/<%= pkg.name %>.min.js'
            }
        },
        mincss: {
            dist: {
                files: {
                    'dist/min/<%= pkg.name %>.min.css': ['src/css/<%= pkg.name %>.css']
                }
            }
        },
        lint: {
            files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
        },
        watch: {
            js: {
                files: '<config:lint.files>',
                tasks: 'lint'
            },
            less: {
                files: 'src/**/*.less',
                tasks: 'less'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                devel: true
            },
            globals: {
                jQuery: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib');
    grunt.registerTask('default', 'lint concat:dist concat:distcss min mincss concat:mincss');

};
