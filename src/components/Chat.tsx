import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface Message {
    id: number
    messageId: string
    text: string
    sender: 'user' | 'recipient'
}

const Chat: React.FC = () => {
    const navigate = useNavigate()
    const [messageText, setMessageText] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const processedMessageIds = useRef<Set<string>>(new Set())
    const idInstance = localStorage.getItem('idInstance') || ''
    const apiTokenInstance = localStorage.getItem('apiTokenInstance') || ''
    const phone = localStorage.getItem('phone') || ''

    if (!idInstance || !apiTokenInstance || !phone) {
        navigate('/authorization')
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const pollMessages = async () => {
        let delay = 100
        try {
            const response = await fetch(
                `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
                { method: 'GET' }
            )
            const data = await response.json()
            if (!data || !data.body) {
                delay = 5000
            } else {
                if (
                    data.body.typeWebhook === 'incomingMessageReceived' &&
                    data.body.messageData &&
                    data.body.senderData
                ) {
                    const messageId = data.body.idMessage
                    if (!processedMessageIds.current.has(messageId)) {
                        processedMessageIds.current.add(messageId)
                        const newMessage: Message = {
                            id: Date.now(),
                            messageId,
                            text: data.body.messageData.textMessageData?.textMessage || '',
                            sender: 'recipient'
                        }
                        setMessages((prev) => [...prev, newMessage])
                    }
                }
                if (data.receiptId) {
                    await fetch(
                        `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${data.receiptId}`,
                        { method: 'DELETE' }
                    )
                }
            }
        } catch (error) {
            console.error('Polling error:', error)
            delay = 5000
        } finally {
            setTimeout(pollMessages, delay)
        }
    }

    useEffect(() => {
        pollMessages()
    }, [idInstance, apiTokenInstance, phone])

    const sendMessage = async () => {
        if (!messageText.trim()) {
            alert('Введите текст сообщения')
            return
        }
        try {
            const response = await fetch(
                `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chatId: phone + '@c.us',
                        message: messageText
                    })
                }
            )
            if (!response.ok) {
                throw new Error('Ошибка отправки сообщения')
            }
            const newMessage: Message = {
                id: Date.now(),
                messageId: '',
                text: messageText,
                sender: 'user'
            }
            setMessages((prev) => [...prev, newMessage])
            setMessageText('')
        } catch (error) {
            alert('Ошибка при отправке сообщения: ' + error)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className='chat-container'>
            <div className='chat-header'>
                <button onClick={() => navigate('/chat-selection')} className='back-button'>
                    Назад
                </button>
                <h2>Чат с {phone}</h2>
            </div>
            <div className='chat-box'>
                <div className='messages'>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            <span>{msg.text}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className='message-input'>
                    <input
                        type='text'
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder='Введите сообщение'
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
            </div>
        </div>
    )
}

export default Chat
