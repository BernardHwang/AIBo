package com.bernardhwang.frontend

import expo.modules.splashscreen.SplashScreenManager

import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.net.Uri
import android.content.Intent
import android.app.role.RoleManager
import android.content.Context
import android.os.Build.VERSION.SDK_INT
import android.os.Build.VERSION_CODES

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.ReactApplication

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreenManager.registerOnActivity(this)
    super.onCreate(savedInstanceState)

    // Ask for overlay permission
    if (!Settings.canDrawOverlays(this)) {
      val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:$packageName")
      )
      startActivity(intent)
    }

    // Ask user to set this app as the assistant (for Android 10+)
    if (SDK_INT >= VERSION_CODES.Q) {
      val roleManager = getSystemService(Context.ROLE_SERVICE) as RoleManager
      if (!roleManager.isRoleHeld(RoleManager.ROLE_ASSISTANT)) {
        val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_ASSISTANT)
        startActivity(intent)
      }
    } else {
      // Fallback for Android < 10, open Assist settings
      val intent = Intent(Settings.ACTION_VOICE_INPUT_SETTINGS)
      startActivity(intent)
    }
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)

    if (intent?.action == Intent.ACTION_ASSIST) {
      val reactInstanceManager = (application as ReactApplication)
        .reactNativeHost.reactInstanceManager

      val reactContext = reactInstanceManager.currentReactContext

      reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        ?.emit("onAssistantTrigger", null)
    }
  }

  override fun getMainComponentName(): String = "main"

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
      this,
      BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
      object : DefaultReactActivityDelegate(
        this,
        mainComponentName,
        fabricEnabled
      ) {}
    )
  }

  override fun invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        super.invokeDefaultOnBackPressed()
      }
      return
    }

    super.invokeDefaultOnBackPressed()
  }
}
