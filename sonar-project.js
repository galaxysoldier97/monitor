const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
    serverUrl: 'https://sonarqube.steelhome.internal',
    options: {
        'sonar.sources': '.',
        'sonar.inclusions': 'src/**/*.ts, src/**/*.tsx, src/**/*.js, src/**/*.jsx', // Entry point of your code
        'sonar.exclusions': 'src/**/*.test.ts, src/**/*.test.tsx, src/index.tsx, src/config/**/*, src/mockObject/**/*',
        'sonar.login': '389ffae32395b34187c0fe2d1a5519b9d0dca377',
        'sonar.projectKey': 'tecrep-monitor',
        'sonar.language': 'javascript',
        'sonar.qualitygate.wait': 'true',
        'sonar.qualitygate.timeout': '300',
        'sonar.branch.name': 'develop'
    }
}, () => {});
