package com.bernardhwang.frontend // Ensure this package is correct based on your file structure

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.service.voice.VoiceInteractionSession
import android.app.assist.AssistContent
import android.app.assist.AssistStructure
import android.os.Handler
import android.os.Looper
import android.util.Log

import com.bernardhwang.frontend.R // Make sure this R is correct for your project

class VoiceInteractionSession(context: Context) : VoiceInteractionSession(context) {

    init {
        Log.d("VoiceSession", "VoiceInteractionSession instance created.")
    }

    // Step 1: Implement onCreateContentView to provide the layout for your session
    // This method is called once when the content view is first needed.
    override fun onCreateContentView(): View? {
        Log.d("VoiceSession", "onCreateContentView called!")
        val inflater = LayoutInflater.from(context)
        val sessionLayout = inflater.inflate(R.layout.assistant_overlay, null)
        if (sessionLayout == null) {
            Log.e("VoiceSession", "Failed to inflate assistant_overlay.xml! Check layout file.")
        } else {
            Log.d("VoiceSession", "Layout 'assistant_overlay.xml' inflated successfully.")
        }
        return sessionLayout
    }

    override fun onShow(args: Bundle?, showFlags: Int) {
        super.onShow(args, showFlags)
        Log.d("VoiceSession", "onShow triggered, setting content view.")

        // Step 2: Set the content view for the session's window
        // This is what makes your native overlay visible.
        val contentView = onCreateContentView()
        if (contentView != null) {
            setContentView(contentView)
            Log.d("VoiceSession", "Content view set successfully.")
        } else {
            Log.e("VoiceSession", "Content view is null, cannot set!")
        }


        // Optional: Auto-hide after a delay. This will hide the entire session.
        Handler(Looper.getMainLooper()).postDelayed({
            Log.d("VoiceSession", "Auto-hiding session after 5 seconds.")
            hide() // Call hide() to dismiss the session
        }, 5000)
    }

    override fun onHide() {
        super.onHide()
        Log.d("VoiceSession", "onHide triggered.")
        // If you had any ongoing processes, like speech recognition, you'd stop them here.
    }

    override fun onHandleAssist(data: Bundle?, structure: AssistStructure?, content: AssistContent?) {
        super.onHandleAssist(data, structure, content)
        Log.d("VoiceSession", "onHandleAssist called.")
        // This is where you'd process the context from the user's screen.
        // You could update your session's UI based on this data.
    }
}