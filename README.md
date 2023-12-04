# Mind Over Matter

### Base technologies:
- React
- Redux
- Typescript
- Tailwind
- Storybook
- Jest
- Serverless
- AWS Lambda
- AWS DynamoDB

Provide pipeline with credentials for deployments

Log into Serverless for local deployments

Prep AWS Environment
- Create your S3 buckets for each environment
- Create SSM Parameter Store values to hold your bucket name for each environment
  - Pattern is: /project-name/environment/BUCKET_NAME
  - e.g. /new-project/dev/BUCKET_NAME
- Modify serverless.yml with project name
  - service: field
  - custom: > s3sync: > bucketName: field

### Install Dependencies

1. Ensure v14.18.1 of node is installed
1. npm install
1. cd react
1. npm install

### Run Storybook

1. cd react
1. npm run storybook

### Run the React App

1. cd react
1. npm run start

### Capacitor (iOS)

Open the project
1. cd react
2. npx cap open ios

Run the project
1. cd react
2. npm run build
3. npx cap sync ios
4. npx cap run ios

### Capacitor (Android)

Open the project
1. cd react
2. npx cap open android

Run the project
1. cd react
2. npm run build
3. npx cap sync android
4. npx cap open android
5. If no devices have been created in Android Studio yet: Create a device using [these docs](https://developer.android.com/studio/run/managing-avds#createavd). 
6. Run the applicaiton from within Android Studio

### Live reload

Requirements: install ionic cli globally `npm install -g @ionic/cli`
1. Add the ff lines in capacitor.config.json (do not commit)
  ```
    server: {
      url: "http://localhost:8100"
    }
  ``` 

2. `cd react`
3. `ionic serve` - check that the output address of this command is the same as the address in step 1
4. Then in a separate terminal open the project in xcode or android studio and run the emulator
5. Check that the IDE indicates app is being served from the address added in capacitor config


## Testing

### Prepare your environment by installing the local DynamoDB requirements:

* Ensure you have Java installed (may require a computer restart) 

#### Steps:
1. npm install -g nodemon
1. sls dynamodb install --config serverless.dev.yml

### To start the local Serverless instance (Lambda execution and DynamoDB)

- npm run debug:watch (or watch-windows on Windows machines)
Note: if on windows, the VS Code terminal will run serverless, one command prompt will run the database, and a second command prompt will run the stripe-cli

### To start the React application pointing to the local servers

1. cd react
1. npm run dev (or dev-windows on Windows machines)
#
## VSCode Testing

To use the debugger and enable breakpoints while running the test suite:
- Go to the Run & Debug tab on the left side navigation
- Select the "Debug tests single run" process
- Click the Play button

This will attach the debugger to the test process and stop on your defined breakpoints. Note that tests may fail due to a timeout if the debugger has paused at a breakpoint. If this occurs, re-run the suite without the debugger to confirm.

To use the debugger with the local Lambda execution process:
- Start the local Serverless instance with the above process
- Open the VSCode command pallette (Shift+Command+P on Mac)
- Search for Debug: Attach to Node Process and select it
- Look for the option that starts with "node --inspect=127.0.0.1 ... serverless offline ..." and select it
- VSCode will now launch debugger tools for breakpoints set in the Lambda handlers

#
## Adding data to the DynamoDB seeds

The DB is reinitalized on launch with information in the seed files (resources/seeds directory). Create one seed file per table and add information in JSON format. If you need to seed additional tables, you will need to extend the seeds definition in the serverless.dev.yml file (custom:dynamodb:seed sections).


## React Environment Variables

If you want variables to be inserted into the React project during the build process, you need to include them in the pipeline environment. This is configured in the Bitbucket console for the repository. 
