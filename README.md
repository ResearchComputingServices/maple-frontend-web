# MAPLE Frontend - Web UI
## Description

NextJS based Frontend Web UI App for the Maple project.

## Prerequsites

- NodeJS version 18.x and above:
  https://nodejs.org/en/download
- Yarn:
  https://www.npmjs.com/package/yarn
- Git: https://git-scm.com/downloads

### Verify prerequsites are installed

```bash
# Check NodeJS is installed
$ node --version

# Check NPM is installed
$ npm --version

# Check Yarn is installed
$ yarn --version

# Check Git is installed
$ git --version
```

## Installation

Install Maple Frontend Web UI App

### Git Clone

```bash
# Clone the project
$ git clone git@github.com:ResearchComputingServices/maple-frontend-web.git
```

### Install App Dependencies

```bash
# Navigate to the project directory
$ cd maple-frontend-web

# Install node modules
$ yarn install
```

## Running the app

```bash
# Navigate to the project directory
$ cd maple-frontend-web

# development
$ yarn run dev

```

## Setting Environment Variables for the app

```bash
# Create .env file and export following variables
NEXTAUTH_SECRET=<Secret Value String>
NEXTAUTH_URL=<URL of the Web App>

# Create .env.development or .env.production file depending upon the web app environment and export following variables
NEXT_PUBLIC_LOGIN_CODE=<CRYPTO SHA256 String>
NEXT_PUBLIC_PWD_CODE=<CRYPTO SHA256 String>

```

## License

[MIT licensed](LICENSE).
