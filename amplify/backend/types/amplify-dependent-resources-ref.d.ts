export type AmplifyDependentResourcesAttributes = {
  "auth": {
    "marketadminpanel": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    },
    "userPoolGroups": {
      "managersGroupRole": "string",
      "superadminsGroupRole": "string",
      "viewersGroupRole": "string"
    }
  },
  "storage": {
    "market": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}