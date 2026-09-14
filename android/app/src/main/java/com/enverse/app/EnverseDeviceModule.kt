package com.enverse.app

import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileInputStream
import java.security.KeyFactory
import java.security.MessageDigest
import java.security.Signature
import java.security.spec.X509EncodedKeySpec

class EnverseDeviceModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "EnverseDevice"

  @ReactMethod
  fun getPackageInfo(packageName: String, promise: Promise) {
    try {
      @Suppress("DEPRECATION")
      val info = context.packageManager.getPackageInfo(packageName, 0)
      val result = Arguments.createMap().apply {
        putBoolean("installed", true)
        putString("packageName", packageName)
        putString("versionName", info.versionName ?: "")
        @Suppress("DEPRECATION")
        putDouble("versionCode", if (Build.VERSION.SDK_INT >= 28) info.longVersionCode.toDouble() else info.versionCode.toDouble())
      }
      promise.resolve(result)
    } catch (_: PackageManager.NameNotFoundException) {
      promise.resolve(Arguments.createMap().apply {
        putBoolean("installed", false)
        putString("packageName", packageName)
        putString("versionName", "")
        putDouble("versionCode", 0.0)
      })
    } catch (error: Exception) {
      promise.reject("PACKAGE_INFO_FAILED", error)
    }
  }

  @ReactMethod
  fun sha256(uriString: String, promise: Promise) {
    try {
      val uri = Uri.parse(uriString)
      val stream = if (uri.scheme == "content") {
        context.contentResolver.openInputStream(uri)
      } else {
        FileInputStream(File(uri.path ?: uriString))
      } ?: throw IllegalArgumentException("Dosya açılamadı")
      val digest = MessageDigest.getInstance("SHA-256")
      stream.use { input ->
        val buffer = ByteArray(128 * 1024)
        while (true) {
          val read = input.read(buffer)
          if (read <= 0) break
          digest.update(buffer, 0, read)
        }
      }
      promise.resolve(digest.digest().joinToString("") { "%02x".format(it) })
    } catch (error: Exception) {
      promise.reject("HASH_FAILED", error)
    }
  }

  @ReactMethod
  fun verifyRsaSha256(payload: String, signatureBase64: String, publicKeyBase64: String, promise: Promise) {
    try {
      val cleanKey = publicKeyBase64.replace(Regex("-----[^-]+-----|\\s"), "")
      val key = KeyFactory.getInstance("RSA").generatePublic(X509EncodedKeySpec(Base64.decode(cleanKey, Base64.DEFAULT)))
      val verifier = Signature.getInstance("SHA256withRSA")
      verifier.initVerify(key)
      verifier.update(payload.toByteArray(Charsets.UTF_8))
      promise.resolve(verifier.verify(Base64.decode(signatureBase64, Base64.DEFAULT)))
    } catch (error: Exception) {
      promise.reject("SIGNATURE_CHECK_FAILED", error)
    }
  }
}
