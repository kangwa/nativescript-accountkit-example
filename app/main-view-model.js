var app = require("application");
var appSettings = require("application-settings");
var Observable = require("data/observable").Observable;


function accountKitLogin(loginType) {
    var APP_REQUEST_CODE = appSettings.getNumber("APP_REQUEST_CODE");
    var activity = app.android.foregroundActivity || app.android.startActivity;
    var accountKitActivity = com.facebook.accountkit.ui.AccountKitActivity;
    var accountKitConfig = com.facebook.accountkit.ui.AccountKitConfiguration;

    activity.onActivityResult = function (requestCode, resultCode, data) {
        if (requestCode === APP_REQUEST_CODE) {

            var loginResult = data.getParcelableExtra(com.facebook.accountkit.AccountKitLoginResult.RESULT_KEY);
            if (loginResult.getError() != null) {

            } else if (loginResult.wasCancelled()) {
                console.log("Login Cancelled");
            } else {
                if (loginResult.getAccessToken() != null) {
                    toastMessage = "Success:" + loginResult.getAccessToken().getAccountId();
                } else {
                    toastMessage = "Success: " + loginResult.getAuthorizationCode().substring(0, 10);
                }
                console.log(toastMessage);
            }
        }
    }

    var intent = new android.content.Intent(activity, accountKitActivity.class);
    var configBuilder = new accountKitConfig.AccountKitConfigurationBuilder(loginType, accountKitActivity.ResponseType.CODE);

    intent.putExtra(
        accountKitActivity.ACCOUNT_KIT_ACTIVITY_CONFIGURATION,
        configBuilder.build()
    )

    activity.startActivityForResult(intent, APP_REQUEST_CODE);
};

function createViewModel() {
    var viewModel = new Observable();

    viewModel.onLoaded = function () {
        var accountKit = com.facebook.accountkit.AccountKit;
        var accessToken = accountKit.getCurrentAccessToken();

        if (accessToken != null) {
            // TODO: Navigate to another view
        }
    }

    viewModel.phoneLogin = function () {
        var phoneLoginType = com.facebook.accountkit.ui.LoginType.PHONE;
        accountKitLogin(phoneLoginType)
    }

    viewModel.emailLogin = function () {
        var emailLoginType = com.facebook.accountkit.ui.LoginType.EMAIL;
        accountKitLogin(emailLoginType)
    }

    return viewModel;
}

exports.createViewModel = createViewModel;