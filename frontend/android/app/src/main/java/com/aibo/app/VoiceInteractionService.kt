package com.aibo.app

import android.content.Intent
import android.os.IBinder
import android.service.voice.VoiceInteractionService
import android.util.Log

class VoiceInteractionService : VoiceInteractionService() {
    override fun onReady() {
        super.onReady()
        Log.d("VoiceInteractionService", "Service is ready")
    }

    override fun onShutdown() {
        super.onShutdown()
        Log.d("VoiceInteractionService", "Service is shutting down")
    }
}
