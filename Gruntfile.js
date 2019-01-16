module.exports = function (grunt) {
    const tmpFolderName = "tmp";
    const getTempFolderDestination = subFolder => `${tmpFolderName}/${subFolder}`;
    const javascriptBundles = {
        "public/app.min.js": [
            getTempFolderDestination("js/app.js")
        ]
    };
    const renameFile = (dest, src) => dest + src.replace('.css', '.min.css');
    const formatDateTime = () => {
        const padZero = num => (num < 10 ? "0" + num : num);

        const date = new Date();
        const year = date.getFullYear();
        const month = padZero(date.getMonth() + 1); // months are zero indexed
        const day = padZero(date.getDate());
        const hour = padZero(date.getHours());
        const minute = padZero(date.getMinutes());
        const second = padZero(date.getSeconds());

        return `${year}-${month}-${day} ${hour}-${minute}-${second}`;
    };

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks('grunt-stylelint');
    grunt.loadNpmTasks('grunt-sass');

    // Project configuration.
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: [
                    ["env", { modules: false }]
                ],
                plugins: ["transform-object-rest-spread"]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/',
                        src: ['*.js'],
                        dest: getTempFolderDestination('js')
                    }
                ]
            }
        },
        uglify: {
            options: {
                mangle: {
                    reserved: ["$", "jQuery"]
                },
                compress: true
            },
            dist: {
                files: javascriptBundles
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                files: javascriptBundles
            }
        },
        watch: {
            assets: {
                files: ["src/js/*.js", "src/css/*.scss"],
                tasks: ['build:dev'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        },
        clean: [tmpFolderName],
        eslint: {
            options: {
                configFile: '.eslintrc',
                format: 'html',
                outputFile: `reports/eslint${formatDateTime()}.html`,
                fix: true
            },
            target: [
                'src/js/*.js'
            ]
        },
        sass: {
            options: {
                style: 'expanded',
                sourcemap: 'none',
                noCache: true,
                compass: false
            },
            dist: {
                files: {
                    [getTempFolderDestination('css/app.css')]: 'src/css/default.scss'
                }
            }
        },
        cssmin: {
            options: {
                level: 1
            },
            target: {
                files: [
                    {
                        expand: true,
                        extDot: "last",
                        cwd: getTempFolderDestination('css'),
                        src: ['*.css'],
                        dest: 'public/css/',
                        ext: '.min.css'
                    }]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: getTempFolderDestination('css'),
                        dest: 'public/css/',
                        src: ['*.css'],
                        rename: renameFile
                    }]
            }
        },
        stylelint: {
            options: {
                configFile: '.stylelintrc',
                syntax: 'scss',
                failOnError: true,
                formatter: 'verbose',
            },
            src: [
                'src/css/*.scss'
            ]
        }
    });


    // Default task(s).
    grunt.registerTask('build:dev', ["stylelint", "eslint", "babel", "concat", "sass", "copy", "clean"]);
    grunt.registerTask('build:prod', ["stylelint", "eslint", "sass", "cssmin", "babel", "uglify", "clean"]);
    
    grunt.registerTask('default', ["build:dev"]);
};
