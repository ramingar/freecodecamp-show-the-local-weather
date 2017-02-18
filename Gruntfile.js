module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            scripts: {
                files: ['./src/*.js'],
                tasks: ['shell:rollup']
            }
        },
        shell: {
            rollup: {
                command: 'node rollup.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('rollup', ['shell:rollup']);
};