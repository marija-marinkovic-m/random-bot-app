# random-bot-app

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Requirements

- Slack workspace with admin access
- Notion account with API access
- AWS account; AWS CLI

```bash
sam build
sam deploy --guided
```

1. Create custom bot for slack
2. Configure slash command to accept requests and save them to Notion
3. Nudge shortcut
4. Connect Slack App to Notion (https://www.notion.so/my-integrations)
5. Install Slack App to your workspace (https://api.slack.com/apps/)
6. Configure bot permissions, interactivity, slash commands with the request URL (using API Gateway endpoint URL for RandomBot function)
7. Populate environment variables listed in `template.yaml`

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
random-bot-app$ sam build
```

Run functions locally and invoke them with the `sam local invoke` command.

```bash
random-bot-app$ sam local invoke RandomBotFunction --event events/event.json
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
random-bot-app$ sam local start-api
random-bot-app$ curl http://localhost:3000/
```

## Logs

```bash
random-bot-app$ sam logs -n RandomBotFunction --stack-name random-bot-app --tail
```

## Unit tests

```bash
random-bot-app$ cd src
src$ npm install
src$ npm run test
```

## Cleanup

To delete the application can use the AWS CLI:

```bash
sam delete --stack-name random-bot-app
```
