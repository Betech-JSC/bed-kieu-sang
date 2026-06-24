<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';

const isOpen = ref(false);
const messages = ref([]);
const newMessage = ref('');
const isLoading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(true);
const messageContainerRef = ref(null);
const isInitialized = ref(false);

const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value && !isInitialized.value) {
        initializeChat();
    }
};

const initializeChat = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get(route('admin.ai-chats.index'));
        messages.value = response.data.messages;
        hasMore.value = response.data.has_more;
        isInitialized.value = true;
        
        await nextTick();
        scrollToBottom();
    } catch (error) {
        console.error('Error fetching chat history:', error);
    } finally {
        isLoading.value = false;
    }
};

const scrollToBottom = () => {
    if (messageContainerRef.value) {
        messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight;
    }
};

const handleScroll = async (e) => {
    const container = e.target;
    // Trigger when scrolled to top
    if (container.scrollTop === 0 && hasMore.value && !loadingMore.value && messages.value.length > 0) {
        await loadOlderMessages();
    }
};

const loadOlderMessages = async () => {
    const firstMsg = messages.value[0];
    if (!firstMsg) return;

    loadingMore.value = true;
    console.log(`[AI Chat] Đang tải tin nhắn cũ hơn trước ID: ${firstMsg.id}...`);

    try {
        const container = messageContainerRef.value;
        const oldScrollHeight = container.scrollHeight;

        const response = await axios.get(route('admin.ai-chats.index'), {
            params: { before_id: firstMsg.id }
        });

        const oldMsgs = response.data.messages;
        hasMore.value = response.data.has_more;

        console.log('Các tin nhắn cũ hơn đã tải:', oldMsgs);

        if (oldMsgs.length > 0) {
            messages.value = [...oldMsgs, ...messages.value];
            await nextTick();
            // Retain scroll position relative to the previous content
            container.scrollTop = container.scrollHeight - oldScrollHeight;
        }
    } catch (error) {
        console.error('Error loading older messages:', error);
    } finally {
        loadingMore.value = false;
    }
};

const sendMessage = async () => {
    if (!newMessage.value.trim() || isLoading.value) return;

    const userText = newMessage.value;
    newMessage.value = '';
    
    // Add user message locally for immediate feedback
    const tempUserMsg = {
        id: Date.now(),
        role: 'user',
        message: userText,
        created_at: new Date().toISOString()
    };
    messages.value.push(tempUserMsg);
    
    isLoading.value = true;
    await nextTick();
    scrollToBottom();

    try {
        const response = await axios.post(route('admin.ai-chats.store'), {
            message: userText
        });

        const { user_message, model_message } = response.data;

        // Replace temporary user message with the real one, and add model response
        const idx = messages.value.findIndex(m => m.id === tempUserMsg.id);
        if (idx !== -1) {
            messages.value[idx] = user_message;
        }
        messages.value.push(model_message);

        await nextTick();
        scrollToBottom();
    } catch (error) {
        console.error('Error sending message:', error);
        messages.value.push({
            id: Date.now() + 1,
            role: 'model',
            message: 'Đã có lỗi xảy ra khi kết nối tới trợ lý AI. Vui lòng thử lại sau.'
        });
        await nextTick();
        scrollToBottom();
    } finally {
        isLoading.value = false;
    }
};

const formatMessage = (text) => {
    if (!text) return '';
    
    // Basic HTML escaping to prevent XSS
    let escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Bold text **bold**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Code blocks ```code```
    escaped = escaped.replace(/```([\s\S]*?)```/g, '<pre class="bg-zinc-800 text-zinc-100 p-3 rounded-lg my-2 overflow-x-auto text-xs font-mono">$1</pre>');
    
    // Inline code `code`
    escaped = escaped.replace(/`(.*?)`/g, '<code class="bg-zinc-200 text-rose-600 px-1 rounded font-mono text-xs">$1</code>');
    
    // Line breaks
    return escaped.replace(/\n/g, '<br>');
};
</script>

<template>
    <div class="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
        <!-- Chat Window -->
        <div
            v-if="isOpen"
            class="w-96 h-[500px] mb-4 bg-[#FFFDF9] border border-zinc-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right"
        >
            <!-- Chat Header -->
            <div class="bg-[#043616] text-[#FFFDF9] px-4 py-3 flex items-center justify-between border-b border-[#FAF6EE]/10 shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-[#E5C44B] text-[#043616] flex items-center justify-center font-bold font-serif shadow-inner">
                        AI
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold tracking-wide text-[#E5C44B]">Trợ lý AI Gemini</h4>
                        <span class="text-[10px] text-[#FAF6EE]/75 flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Trực tuyến
                        </span>
                    </div>
                </div>
                <button
                    @click="toggleChat"
                    class="p-1 hover:bg-[#FAF6EE]/15 rounded-lg transition-colors text-[#FAF6EE]/70 hover:text-white"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Messages Area -->
            <div
                ref="messageContainerRef"
                @scroll="handleScroll"
                class="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF6EE]/30"
                style="scroll-behavior: auto;"
            >
                <!-- Loading older messages indicator -->
                <div v-if="loadingMore" class="flex justify-center items-center py-2 gap-2 text-xs text-zinc-500">
                    <svg class="animate-spin h-4 w-4 text-emerald-700" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang tải tin nhắn cũ...</span>
                </div>

                <!-- Empty State -->
                <div v-if="messages.length === 0 && !isLoading" class="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div class="w-12 h-12 rounded-full bg-[#FAF6EE] flex items-center justify-center text-zinc-400">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <div>
                        <h5 class="text-sm font-semibold text-zinc-700">Chưa có cuộc hội thoại nào</h5>
                        <p class="text-xs text-zinc-500 mt-1">Hãy đặt câu hỏi để bắt đầu cuộc trò chuyện với Gemini.</p>
                    </div>
                </div>

                <!-- Message List -->
                <div
                    v-for="msg in messages"
                    :key="msg.id"
                    class="flex flex-col"
                    :class="msg.role === 'user' ? 'items-end' : 'items-start'"
                >
                    <div
                        :class="[
                            msg.role === 'user'
                                ? 'bg-[#043616] text-[#FFFDF9] rounded-2xl rounded-tr-none'
                                : 'bg-white text-zinc-800 rounded-2xl rounded-tl-none border-l-4 border-[#E5C44B] shadow-sm',
                            'px-4 py-2.5 max-w-[85%] text-sm leading-relaxed breakdown-words shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                        ]"
                        v-html="formatMessage(msg.message)"
                    ></div>
                </div>

                <!-- Typing indicator -->
                <div v-if="isLoading" class="flex items-start gap-2">
                    <div class="bg-white text-zinc-800 rounded-2xl rounded-tl-none border-l-4 border-[#E5C44B] px-4 py-3 shadow-sm flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style="animation-delay: 0ms"></span>
                        <span class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style="animation-delay: 150ms"></span>
                        <span class="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style="animation-delay: 300ms"></span>
                    </div>
                </div>
            </div>

            <!-- Input Bar -->
            <form @submit.prevent="sendMessage" class="p-3 border-t border-zinc-200 bg-white flex items-center gap-2 shrink-0">
                <input
                    v-model="newMessage"
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    class="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#043616] focus:bg-white transition-all duration-200 text-zinc-800 placeholder-zinc-400"
                    :disabled="isLoading"
                />
                <button
                    type="submit"
                    :disabled="!newMessage.trim() || isLoading"
                    class="p-2.5 bg-[#043616] text-[#E5C44B] rounded-xl hover:bg-[#032610] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm"
                >
                    <svg class="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>

        <!-- Chat Trigger Button -->
        <button
            @click="toggleChat"
            class="w-14 h-14 bg-[#043616] text-[#E5C44B] shadow-xl rounded-full flex items-center justify-center hover:bg-[#032610] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none relative group border border-[#E5C44B]/20"
        >
            <span class="absolute inline-flex h-full w-full rounded-full bg-[#043616]/30 animate-ping group-hover:hidden"></span>
            
            <!-- Chat Icon -->
            <svg
                v-if="!isOpen"
                class="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <!-- Close Icon -->
            <svg
                v-else
                class="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>
