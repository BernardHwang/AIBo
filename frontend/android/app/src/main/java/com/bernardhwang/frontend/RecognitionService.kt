package com.bernardhwang.frontend

import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionService
import android.speech.SpeechRecognizer // ← important import

class RecognitionService : RecognitionService() {
    override fun onStartListening(intent: Intent?, callback: Callback?) {
        val resultBundle = Bundle()
        resultBundle.putStringArrayList(
            SpeechRecognizer.RESULTS_RECOGNITION, // ← fixed
            arrayListOf("hello", "what can you do?")
        )
        callback?.results(resultBundle)
    }

    override fun onStopListening(callback: Callback?) {}
    override fun onCancel(callback: Callback?) {}
}
