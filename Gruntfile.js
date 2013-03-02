
module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('validatr.jquery.json'),

        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        
        // Task configuration.
        clean: {
            files: ['dist', 'docs/release', 'docs/libs']
        },

        copy: {
            release: {
                files: [
                    { src: ['libs/**'], dest: 'docs/' },
                    { src: ['tests/*.js'], dest: 'docs/' },
                    { src: ['dist/min/validatr.min.js'], dest: 'docs/assets/js/', expand: true, flatten: true },
                    { src: ['dist/min/validatr.min.css'], dest: 'docs/assets/css/', expand: true, flatten: true }
                ]
            }
        },

        compress: {
            release: {
                options: {
                    archive: 'docs/release/<%= pkg.name %>.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**'],
                        dest: '<%= pkg.name %>'
                    }
                ]
            }
        },

        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/js/<%= pkg.name %>.js'],
                dest: 'dist/src/<%= pkg.name %>.js'
            },
            distcss: {
                src: ['src/css/<%= pkg.name %>.css'],
                dest: 'dist/src/<%= pkg.name %>.css'
            }
        },

        cssmin: {
            dist: {
                files: {
                    'dist/min/<%= pkg.name %>.min.css': ['<%= concat.distcss.dest %>']
                }
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/min/<%= pkg.name %>.min.js'
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
                devel: true,
                globals: {
                    jQuery: true,
                    module: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: ['src/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'tests/.jshintrc'
                },
                src: ['tests/*.js']
            }
        },

        qunit: {
            files: ['tests/*.html']
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('release', ['qunit', 'clean', 'concat', 'cssmin', 'uglify', 'compress', 'copy']);
};
