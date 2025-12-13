# FlexPro v2 Interactive Features Guide

## Overview

The Interactive Layer transforms FlexPro v2 from a read-only planning tool into a dynamic fitness companion. Clients can now actively track workouts, communicate with coaches, upload progress photos, and save custom diet templates.

## 🏗️ Architecture Overview

### Real-time Communication
- **Supabase Realtime** for instant messaging
- **Optimistic UI** updates for smooth UX
- **Typing indicators** and read receipts

### Offline-First Design
- **Local caching** with background sync
- **Conflict resolution** strategies
- **Network-aware** operations

### Secure Data Management
- **Row Level Security** on all tables
- **Storage policies** for photo uploads
- **Input sanitization** against XSS attacks

---

## 📋 Implementation Steps

### Step 1: Database Setup

Execute `supabase_interactive.sql` in your Supabase SQL editor:

```sql
-- Creates all tables, indexes, policies, and functions
```

**New Tables:**
- `messages` - Real-time chat messages
- `diet_templates` - Coach-created diet templates
- `workout_logs` - Client workout performance tracking
- `progress_photos` - Photo gallery with metadata

**Storage:**
- `progress-photos` bucket for image uploads

### Step 2: Component Integration

#### Chat System
```tsx
import ChatWindow from '../components/chat/ChatWindow';

// In CoachDashboard or ClientDashboard
<ChatWindow
  otherUser={selectedClient}
  isOpen={chatOpen}
  onClose={() => setChatOpen(false)}
/>
```

#### Workout Logbook
```tsx
import ActiveWorkoutMode from '../components/workout/ActiveWorkoutMode';

// In TrainingPanel
{isActiveMode ? (
  <ActiveWorkoutMode
    workoutPlan={currentPlan}
    onSaveSession={handleSaveSession}
    onLogUpdate={updateLogs}
  />
) : (
  <ReadOnlyWorkoutView plan={currentPlan} />
)}
```

#### Progress Gallery
```tsx
import GalleryPanel from '../components/gallery/GalleryPanel';

// In Progress section
<GalleryPanel
  userId={currentUser.id}
  isCoach={userRole === 'coach'}
/>
```

#### Diet Templates
```tsx
import { useDietTemplates } from '../hooks';

const { templates, saveTemplate, loadTemplate } = useDietTemplates();

// Save current diet as template
await saveTemplate({
  name: 'کتوژنیک پیشرفته',
  description: 'برنامه غذایی برای کاهش وزن سریع',
  diet_data: currentDiet,
  diet_rest_data: restDayDiet
});

// Load template
const template = await loadTemplate(templateId);
setCurrentDiet(template.diet_data);
```

### Step 3: Hook Usage

#### Chat Hook
```tsx
const {
  messages,
  sendMessage,
  markAsRead,
  isTyping,
  setTyping
} = useChat(otherUserId);

// Send message
await sendMessage('سلام! چطور هستید؟');

// Mark as read
await markAsRead();
```

#### Workout Logging
```tsx
const {
  logs,
  sessions,
  saveLog,
  saveSession
} = useWorkoutLog();

// Save individual set
await saveLog({
  workout_date: '2024-01-15',
  exercise_name: 'Squat',
  set_number: 1,
  reps_performed: 8,
  weight_used: 100,
  rpe: 7
});

// Save complete session
await saveSession({
  date: '2024-01-15',
  exercises: sessionLogs,
  totalSets: 12,
  completedSets: 12,
  duration: 45
});
```

#### Progress Photos
```tsx
const {
  photos,
  uploadPhoto,
  getComparisons
} = useProgressPhotos(userId);

// Upload photo
await uploadPhoto(file, {
  photo_date: '2024-01-15',
  pose_type: 'front',
  weight: 75.5,
  notes: '۲ هفته بعد از شروع برنامه'
});

// Get before/after comparisons
const comparisons = getComparisons();
```

---

## 🎨 UI/UX Features

### Chat Interface
- **Floating chat window** that doesn't interrupt workflow
- **Real-time typing indicators**
- **Message status** (sending/sent/read)
- **Auto-scroll** to latest messages
- **Responsive design** for mobile/desktop

### Active Workout Mode
- **Live input fields** for each set
- **Real-time completion tracking**
- **RPE (effort level)** logging
- **Quick save** per set or complete session
- **Progress visualization**

### Progress Gallery
- **Drag-and-drop uploads**
- **Before/after comparisons**
- **Weight tracking integration**
- **Grid and slider views**
- **Metadata tagging** (pose type, date, weight)

### Diet Templates
- **Save current diet** as reusable template
- **Load templates** with one click
- **Public/private** template sharing
- **Template management** (edit/delete)

---

## 🔒 Security Implementation

### Row Level Security Policies

```sql
-- Messages: Users can only access their conversations
CREATE POLICY "Messages access control" ON messages
FOR ALL USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- Workout logs: Users can only modify their own logs
CREATE POLICY "Workout logs ownership" ON workout_logs
FOR ALL USING (auth.uid() = user_id);

-- Diet templates: Coaches control their templates
CREATE POLICY "Diet templates management" ON diet_templates
FOR ALL USING (auth.uid() = coach_id);
```

### Storage Security

```sql
-- Progress photos: Private by default
CREATE POLICY "Photo access control" ON storage.objects
FOR SELECT USING (
  bucket_id = 'progress-photos' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   coach_has_access(auth.uid(), (storage.foldername(name))[1]))
);
```

### Input Sanitization

```tsx
import { sanitizeText, sanitizeHtml } from '../utils/sanitization';

// Safe text rendering
<div>{sanitizeText(userMessage)}</div>

// Safe HTML in templates
<div dangerouslySetInnerHTML={{
  __html: sanitizeHtml(templateContent)
}} />
```

---

## 📊 Performance Optimizations

### Real-time Subscriptions
- **Filtered subscriptions** only for relevant data
- **Debounced updates** to prevent UI spam
- **Connection pooling** for multiple clients

### Data Caching
- **LocalStorage** for offline access
- **IndexedDB** for large datasets (future enhancement)
- **Cache invalidation** strategies

### Image Optimization
- **Progressive loading** for photo gallery
- **Lazy loading** for off-screen images
- **Compression** before upload

---

## 🚀 Advanced Features

### Smart Suggestions
- **Exercise recommendations** based on performance history
- **Diet adjustments** based on progress photos
- **Chat suggestions** for common coaching scenarios

### Analytics Integration
- **Workout completion rates**
- **Progress photo analysis**
- **Communication frequency tracking**

### Multi-device Sync
- **Cross-device synchronization**
- **Conflict resolution** for simultaneous edits
- **Offline queue management**

---

## 🐛 Troubleshooting

### Chat Not Working
```bash
# Check Supabase realtime connection
npx supabase status

# Verify RLS policies
SELECT * FROM messages LIMIT 1;
```

### Photo Upload Fails
```bash
# Check storage bucket permissions
# Verify file size limits (< 10MB)
# Check network connectivity
```

### Sync Issues
```bash
# Clear localStorage sync data
localStorage.removeItem('flexpro_sync_changes');

# Check pending changes
console.log(localStorage.getItem('flexpro_sync_changes'));
```

---

## 📈 Future Enhancements

1. **Video Chat Integration** (WebRTC)
2. **AI-powered Progress Analysis**
3. **Social Features** (client communities)
4. **Wearable Device Integration**
5. **Advanced Analytics Dashboard**

---

## 🎯 Success Metrics

- **User Engagement**: Increased daily active users
- **Workout Completion**: Higher completion rates
- **Photo Uploads**: Regular progress tracking
- **Coach Communication**: More frequent interactions
- **Template Usage**: Higher template adoption

---

**Ready to deploy! 🚀**

The interactive layer transforms FlexPro v2 into a comprehensive fitness ecosystem. Clients now have a complete toolkit for their fitness journey, while coaches gain powerful tools for client management and communication.