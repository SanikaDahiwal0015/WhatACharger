
import { useEffect, useRef, useState } from 'react'
import './ChargerAssistant.css'

const STARTER_MESSAGE = {
  role: 'assistant',
  text: "Hey! I'm ChargerBot, your WhatACharger voice assistant. Ask me to find chargers, check availability, or get host contact details."
}

export default function ChargerAssistant() {
  const [messages, setMessages] = useState([STARTER_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  function speakReply(text) {
    if (!voiceEnabled || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    utterance.rate = 1
    utterance.pitch = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  async function sendMessage(messageText) {
    const message = messageText.trim()

    if (!message || loading) return

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    setIsSpeaking(false)
    setMessages(previous => [
      ...previous,
      { role: 'user', text: message }
    ])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'The assistant could not respond.')
      }

      const reply = data.reply || 'Please try asking another way.'

      setMessages(previous => [
        ...previous,
        { role: 'assistant', text: reply }
      ])

      speakReply(reply)
    } catch (err) {
      setError(err.message || 'Could not connect to the assistant.')
    } finally {
      setLoading(false)
    }
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError(
        'Voice input is not supported in this browser. Try Google Chrome or type your message.'
      )
      return
    }

    if (loading) return

    if (isListening) {
      recognitionRef.current?.stop()
      return
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    setIsSpeaking(false)
    setError('')

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    let recognizedText = ''

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = event => {
      recognizedText = event.results[0][0].transcript.trim()
      setInput(recognizedText)
    }

    recognition.onerror = event => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(
          event.error === 'not-allowed'
            ? 'Please allow microphone access in your browser settings.'
            : `Microphone error: ${event.error}. You can type instead.`
        )
      } else if (event.error === 'no-speech') {
        setError('I did not hear anything. Tap the microphone and try again.')
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null

      if (recognizedText) {
        setInput('')
        sendMessage(recognizedText)
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      setIsListening(false)
      setError('Could not start the microphone. Please try again.')
    }
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  return (
    <div className="charger-assistant">
      {open && (
        <section
          className="assistant-window"
          aria-label="WhatACharger voice assistant"
        >
          <header className="assistant-header">
            <div className="assistant-brand">
              <div
                className={`robot-avatar ${
                  isListening ? 'robot-listening' : ''
                } ${loading ? 'robot-thinking' : ''} ${
                  isSpeaking ? 'robot-speaking' : ''
                }`}
              >
                <span className="robot-eye" />
                <span className="robot-eye" />
                <span className="robot-mouth" />
              </div>

              <div>
                <strong>ChargerBot</strong>
                <p>
                  {isListening
                    ? 'Listening to you...'
                    : loading
                      ? 'Finding your charger...'
                      : isSpeaking
                        ? 'Speaking...'
                        : 'Your EV voice assistant'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="assistant-close"
              onClick={() => {
                setOpen(false)
                recognitionRef.current?.abort()
                setIsListening(false)
                stopSpeaking()
              }}
              aria-label="Close assistant"
            >
              ×
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {messages.map((item, index) => (
              <div
                key={`${index}-${item.role}`}
                className={`assistant-message ${
                  item.role === 'user' ? 'user-message' : 'bot-message'
                }`}
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <div className="assistant-message bot-message">
                Checking chargers...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <p className="assistant-error" role="alert">
              {error}
            </p>
          )}

          <div className="assistant-voice-controls">
            <button
              type="button"
              className={`assistant-mic ${
                isListening ? 'mic-active' : ''
              }`}
              onClick={startListening}
              disabled={loading}
              aria-label={isListening ? 'Stop listening' : 'Speak to ChargerBot'}
              title={isListening ? 'Stop listening' : 'Speak to ChargerBot'}
            >
              {isListening ? '■ Stop listening' : '🎙️ Tap to speak'}
            </button>

            <button
              type="button"
              className={`assistant-voice-toggle ${
                voiceEnabled ? 'voice-on' : ''
              }`}
              onClick={() => {
                if (voiceEnabled) stopSpeaking()
                setVoiceEnabled(value => !value)
              }}
              title={voiceEnabled ? 'Turn voice off' : 'Turn voice on'}
            >
              {voiceEnabled ? '🔊 Voice on' : '🔇 Voice off'}
            </button>
          </div>

          {isSpeaking && (
            <button
              type="button"
              className="assistant-stop-speaking"
              onClick={stopSpeaking}
            >
              Stop speaking
            </button>
          )}

          <form
            className="assistant-form"
            onSubmit={event => {
              event.preventDefault()
              sendMessage(input)
            }}
          >
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Ask ChargerBot anything..."
              aria-label="Message ChargerBot"
              disabled={loading}
            />

            <button type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>

          <p className="assistant-note">
            Speak naturally or type. Confirm bookings before they are created.
          </p>
        </section>
      )}

      <button
        type="button"
        className="assistant-launcher"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
      >
        <span className="launcher-robot">
          <span />
          <span />
        </span>
        {open ? '× Close ChargerBot' : 'Talk to ChargerBot'}
      </button>
    </div>
  )
}
