# 🐠 AquaMind – AI Fish Care App

> A smart assistant app designed to help fishkeepers monitor, manage, and optimize the health and happiness of their fish and aquariums.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Database Schema](#database-schema)
- [Folder Structure](#folder-structure)
- [UI/UX Design](#uiux-design)
- [Development Mode](#development-mode)
- [Update System](#update-system)
- [Cache System](#cache-system)
- [Monetization](#monetization)

---

## 🎯 Project Overview

AquaMind integrates AI, modern UI, smart tracking, GitHub-based updates, and optimized caching to deliver a premium fish care experience. The app focuses on accessibility, offline functionality, and data-driven insights to help both beginner and advanced fishkeepers.

### Key Objectives
- 🤖 AI-powered fish health monitoring and recommendations
- 📊 Smart tank tracking with comprehensive logging
- 📚 Extensive fish and plant encyclopedia
- 👥 Community-driven knowledge sharing
- 📱 Mobile-first, offline-capable design
- 🔄 Automatic updates via GitHub releases
- 🌐 Multi-language support (English and Chinese)

---

## 🚀 Features

### 🧠 AI-Powered Assistant

#### Fish Health Scanner
- Upload photos/videos of fish for AI analysis
- Illness and stress detection using computer vision
- Disease identification with confidence scores
- Treatment recommendations based on symptoms

#### Water Condition Predictor
- Input tank parameters (pH, temperature, ammonia, nitrites, nitrates)
- AI-generated water quality recommendations
- Predictive alerts for potential issues
- Optimal parameter ranges for specific fish species

#### Smart Feeding System
- AI-recommended feeding schedules
- Portion size calculations based on fish type, size, and age
- Nutritional requirement analysis
- Feeding reminder system with smart notifications

#### Tank Mate Compatibility
- AI-powered species compatibility checking
- Aggression level analysis
- Space requirement calculations
- Behavioral pattern predictions

#### Symptom-Based Diagnosis
- Natural language symptom description
- AI-powered disease suggestion engine
- Treatment protocol recommendations
- Emergency care guidelines

### 📊 Smart Tank Tracking

#### Multi-Tank Dashboard
- Visual tank overview with health indicators
- Quick-access to critical parameters
- Tank comparison tools
- Performance analytics

#### Comprehensive Logging System
- Daily water parameter tracking
- Feeding logs with portion tracking
- Cleaning and maintenance schedules
- Fish behavior and growth monitoring
- Photo/video documentation

#### Intelligent Reminder System
- Customizable alert schedules
- Priority-based notifications
- Weather-aware reminders (for outdoor ponds)
- Equipment maintenance tracking

### 📚 Encyclopedia & Knowledge Base

#### Species Database
- 500+ fish species with detailed care guides
- Plant compatibility and care requirements
- Equipment recommendations
- Breeding information and tips

#### Interactive Features
- Advanced search with filters
- Bookmark favorite species
- Care difficulty ratings
- Community reviews and tips

#### AR Preview (Future Feature)
- Visualize fish in your tank using camera
- Size comparison tools
- Virtual tank planning

### 👥 Community & Social Features

#### Knowledge Sharing
- Post questions with photo/video support
- Expert and community answers
- Voting system for best solutions
- AI-generated summaries of discussions

#### Social Interactions
- Follow experienced fishkeepers
- Share tank progress and achievements
- Species-specific discussion groups
- Local fishkeeper meetups
- Multi-language community support (English/Chinese)

---

## 🛠 Technical Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React Native (Expo) | Cross-platform mobile development |
| **Backend** | Supabase | Authentication, database, real-time sync |
| **Storage** | Cloudflare R2 | Photo/video storage and CDN |
| **AI Services** | Cloudflare Workers AI | Text processing and recommendations |
| **Computer Vision** | Roboflow API | Fish health image analysis |
| **Offline Storage** | WatermelonDB | Local data persistence |
| **Notifications** | Expo Push Notifications | Cross-platform push messaging |
| **Updates** | Expo Updates + GitHub | OTA updates and release management |
| **Analytics** | Expo Analytics | Usage tracking and optimization |
| **Internationalization** | react-i18next | Multi-language support (English, Chinese) |

### Development Tools
- **TypeScript** for type safety
- **ESLint + Prettier** for code quality
- **Jest + Detox** for testing
- **GitHub Actions** for CI/CD
- **Flipper** for debugging

---

## 🗄 Database Schema

### Core Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE,
  full_name VARCHAR,
  avatar_url VARCHAR,
  experience_level VARCHAR CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_units VARCHAR DEFAULT 'metric' CHECK (preferred_units IN ('metric', 'imperial')),
  timezone VARCHAR DEFAULT 'UTC',
  notifications_enabled BOOLEAN DEFAULT true,
  ai_suggestions_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `tanks`
```sql
CREATE TABLE tanks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  type VARCHAR CHECK (type IN ('freshwater', 'saltwater', 'brackish', 'pond')),
  volume_liters DECIMAL(8,2),
  length_cm DECIMAL(6,2),
  width_cm DECIMAL(6,2),
  height_cm DECIMAL(6,2),
  setup_date DATE,
  substrate VARCHAR,
  filtration_type VARCHAR,
  heating_type VARCHAR,
  lighting_type VARCHAR,
  co2_system BOOLEAN DEFAULT false,
  photo_url VARCHAR,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `fish`
```sql
CREATE TABLE fish (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tank_id UUID REFERENCES tanks(id) ON DELETE CASCADE,
  species_id UUID REFERENCES species(id),
  name VARCHAR,
  quantity INTEGER DEFAULT 1,
  size_cm DECIMAL(5,2),
  age_months INTEGER,
  sex VARCHAR CHECK (sex IN ('male', 'female', 'unknown')),
  acquisition_date DATE,
  acquisition_source VARCHAR,
  price_paid DECIMAL(8,2),
  health_status VARCHAR DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'sick', 'quarantine', 'deceased')),
  breeding_status VARCHAR CHECK (breeding_status IN ('none', 'gravid', 'spawning', 'brooding')),
  photo_url VARCHAR,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `species`
```sql
CREATE TABLE species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scientific_name VARCHAR UNIQUE NOT NULL,
  common_names VARCHAR[],
  category VARCHAR CHECK (category IN ('fish', 'plant', 'invertebrate')),
  family VARCHAR,
  origin VARCHAR,
  max_size_cm DECIMAL(6,2),
  min_tank_size_liters DECIMAL(8,2),
  temperature_min_c DECIMAL(4,2),
  temperature_max_c DECIMAL(4,2),
  ph_min DECIMAL(3,2),
  ph_max DECIMAL(3,2),
  hardness_min_dgh DECIMAL(4,2),
  hardness_max_dgh DECIMAL(4,2),
  aggression_level INTEGER CHECK (aggression_level BETWEEN 1 AND 5),
  care_difficulty INTEGER CHECK (care_difficulty BETWEEN 1 AND 5),
  diet_type VARCHAR CHECK (diet_type IN ('herbivore', 'carnivore', 'omnivore')),
  social_behavior VARCHAR CHECK (social_behavior IN ('schooling', 'pair', 'solitary', 'territorial')),
  breeding_difficulty INTEGER CHECK (breeding_difficulty BETWEEN 1 AND 5),
  lifespan_years INTEGER,
  description TEXT,
  care_notes TEXT,
  photo_url VARCHAR,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `water_parameters`
```sql
CREATE TABLE water_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tank_id UUID REFERENCES tanks(id) ON DELETE CASCADE,
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  temperature_c DECIMAL(4,2),
  ph DECIMAL(3,2),
  ammonia_ppm DECIMAL(5,3),
  nitrite_ppm DECIMAL(5,3),
  nitrate_ppm DECIMAL(6,2),
  phosphate_ppm DECIMAL(5,3),
  hardness_dgh DECIMAL(4,2),
  alkalinity_dkh DECIMAL(4,2),
  salinity_ppt DECIMAL(4,2),
  dissolved_oxygen_ppm DECIMAL(4,2),
  co2_ppm DECIMAL(4,2),
  tds_ppm INTEGER,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `feeding_logs`
```sql
CREATE TABLE feeding_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tank_id UUID REFERENCES tanks(id) ON DELETE CASCADE,
  fish_id UUID REFERENCES fish(id) ON DELETE SET NULL,
  fed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  food_type VARCHAR NOT NULL,
  food_brand VARCHAR,
  amount_grams DECIMAL(6,3),
  feeding_method VARCHAR CHECK (feeding_method IN ('surface', 'mid-water', 'bottom', 'target')),
  fish_response VARCHAR CHECK (fish_response IN ('eager', 'normal', 'reluctant', 'refused')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `health_records`
```sql
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fish_id UUID REFERENCES fish(id) ON DELETE CASCADE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  symptoms VARCHAR[],
  diagnosis VARCHAR,
  confidence_score DECIMAL(3,2),
  treatment_applied TEXT,
  medication_used VARCHAR,
  dosage VARCHAR,
  treatment_start_date DATE,
  treatment_end_date DATE,
  outcome VARCHAR CHECK (outcome IN ('recovered', 'improving', 'stable', 'worsening', 'deceased')),
  photos VARCHAR[],
  ai_analysis JSONB,
  veterinarian_consulted BOOLEAN DEFAULT false,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `maintenance_logs`
```sql
CREATE TABLE maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tank_id UUID REFERENCES tanks(id) ON DELETE CASCADE,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  maintenance_type VARCHAR NOT NULL CHECK (maintenance_type IN (
    'water_change', 'filter_clean', 'gravel_vacuum', 'glass_clean',
    'equipment_check', 'plant_trim', 'decoration_clean', 'other'
  )),
  water_changed_liters DECIMAL(6,2),
  water_changed_percent DECIMAL(5,2),
  equipment_serviced VARCHAR[],
  products_used VARCHAR[],
  time_spent_minutes INTEGER,
  cost DECIMAL(8,2),
  notes TEXT,
  photos VARCHAR[],
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Community Tables

#### `posts`
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR CHECK (category IN ('question', 'showcase', 'advice', 'emergency')),
  tags VARCHAR[],
  photos VARCHAR[],
  tank_id UUID REFERENCES tanks(id) ON DELETE SET NULL,
  fish_id UUID REFERENCES fish(id) ON DELETE SET NULL,
  is_resolved BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `comments`
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  photos VARCHAR[],
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_accepted_answer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Notification Tables

#### `reminders`
```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tank_id UUID REFERENCES tanks(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL CHECK (type IN (
    'feeding', 'water_change', 'filter_clean', 'water_test',
    'medication', 'equipment_check', 'custom'
  )),
  title VARCHAR NOT NULL,
  description TEXT,
  frequency_days INTEGER,
  next_due_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Cache and Sync Tables

#### `sync_queue`
```sql
CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR NOT NULL,
  record_id UUID NOT NULL,
  operation VARCHAR CHECK (operation IN ('create', 'update', 'delete')),
  data JSONB,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_attempt_at TIMESTAMP WITH TIME ZONE
);
```

### Indexes for Performance
```sql
-- User and tank relationships
CREATE INDEX idx_tanks_user_id ON tanks(user_id);
CREATE INDEX idx_fish_tank_id ON fish(tank_id);
CREATE INDEX idx_water_parameters_tank_id ON water_parameters(tank_id);
CREATE INDEX idx_feeding_logs_tank_id ON feeding_logs(tank_id);
CREATE INDEX idx_health_records_fish_id ON health_records(fish_id);
CREATE INDEX idx_maintenance_logs_tank_id ON maintenance_logs(tank_id);

-- Time-based queries
CREATE INDEX idx_water_parameters_measured_at ON water_parameters(measured_at);
CREATE INDEX idx_feeding_logs_fed_at ON feeding_logs(fed_at);
CREATE INDEX idx_health_records_recorded_at ON health_records(recorded_at);
CREATE INDEX idx_maintenance_logs_performed_at ON maintenance_logs(performed_at);

-- Community features
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Search optimization
CREATE INDEX idx_species_common_names ON species USING GIN(common_names);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
```

---

## 📁 Folder Structure

```
aquamind/
├── 📱 app/                           # Expo Router app directory
│   ├── (auth)/                       # Authentication group
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                       # Main app tabs
│   │   ├── index.tsx                 # Home screen
│   │   ├── tanks.tsx                 # Tank management
│   │   ├── diagnose.tsx              # AI diagnosis
│   │   ├── encyclopedia.tsx          # Species database
│   │   └── profile.tsx               # User profile
│   ├── tank/                         # Tank-specific screens
│   │   ├── [id].tsx                  # Tank details
│   │   ├── create.tsx                # Create new tank
│   │   ├── edit/[id].tsx             # Edit tank
│   │   └── logs/[id].tsx             # Tank logs
│   ├── fish/                         # Fish management
│   │   ├── [id].tsx                  # Fish details
│   │   ├── create.tsx                # Add fish
│   │   └── health/[id].tsx           # Health records
│   ├── community/                    # Community features
│   │   ├── index.tsx                 # Community feed
│   │   ├── post/[id].tsx             # Post details
│   │   └── create-post.tsx           # Create post
│   ├── _layout.tsx                   # Root layout
│   └── +not-found.tsx               # 404 screen
├── 🧩 components/                    # Reusable UI components
│   ├── ui/                           # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressBar.tsx
│   │   └── index.ts
│   ├── forms/                        # Form components
│   │   ├── TankForm.tsx
│   │   ├── FishForm.tsx
│   │   ├── WaterTestForm.tsx
│   │   └── FeedingForm.tsx
│   ├── charts/                       # Data visualization
│   │   ├── WaterParameterChart.tsx
│   │   ├── GrowthChart.tsx
│   │   └── TrendChart.tsx
│   ├── ai/                           # AI-related components
│   │   ├── DiagnosisCard.tsx
│   │   ├── RecommendationList.tsx
│   │   └── ConfidenceIndicator.tsx
│   └── community/                    # Community components
│       ├── PostCard.tsx
│       ├── CommentList.tsx
│       └── VoteButtons.tsx
├── 🔧 lib/                           # Core utilities and configurations
│   ├── supabase/                     # Supabase integration
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   └── types.ts
│   ├── i18n/                         # Internationalization
│   │   ├── index.ts                  # i18n configuration
│   │   ├── en/                       # English translations
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── tanks.json
│   │   │   ├── fish.json
│   │   │   ├── ai.json
│   │   │   └── community.json
│   │   ├── zh/                       # Chinese translations
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── tanks.json
│   │   │   ├── fish.json
│   │   │   ├── ai.json
│   │   │   └── community.json
│   │   └── resources.ts              # Translation resources
│   ├── ai/                           # AI service integrations
│   │   ├── vision.ts                 # Computer vision API
│   │   ├── recommendations.ts        # AI recommendations
│   │   └── diagnosis.ts              # Health diagnosis
│   ├── storage/                      # File storage
│   │   ├── cloudflare-r2.ts
│   │   ├── image-utils.ts
│   │   └── upload.ts
│   ├── database/                     # Local database
│   │   ├── watermelon.ts
│   │   ├── models/
│   │   │   ├── Tank.ts
│   │   │   ├── Fish.ts
│   │   │   ├── WaterParameter.ts
│   │   │   └── index.ts
│   │   └── sync.ts
│   ├── notifications/                # Push notifications
│   │   ├── expo-notifications.ts
│   │   ├── reminders.ts
│   │   └── scheduled.ts
│   ├── cache/                        # Caching system
│   │   ├── manager.ts
│   │   ├── image-cache.ts
│   │   └── data-cache.ts
│   ├── utils/                        # General utilities
│   │   ├── constants.ts
│   │   ├── formatting.ts
│   │   ├── validation.ts
│   │   ├── date-utils.ts
│   │   └── units.ts
│   └── hooks/                        # Custom React hooks
│       ├── useAuth.ts
│       ├── useTanks.ts
│       ├── useWaterParameters.ts
│       ├── useReminders.ts
│       ├── useCache.ts
│       └── useAI.ts
├── 🎨 assets/                        # Static assets
│   ├── images/
│   │   ├── species/                  # Fish and plant images
│   │   ├── icons/                    # App icons
│   │   └── onboarding/               # Onboarding images
│   ├── fonts/                        # Custom fonts
│   └── animations/                   # Lottie animations
├── 📊 constants/                     # App constants
│   ├── Colors.ts                     # Material 3 color scheme
│   ├── Species.ts                    # Species data
│   ├── WaterParameters.ts            # Parameter ranges
│   └── AI.ts                         # AI model configurations
├── 🧪 __tests__/                     # Test files
│   ├── components/
│   ├── lib/
│   ├── app/
│   └── setup.ts
├── 📚 docs/                          # Documentation
│   ├── context.md                    # This file
│   ├── plan.md                       # Development plan
│   ├── api.md                        # API documentation
│   └── database.md                   # Database schema docs
├── 🔨 scripts/                       # Build and utility scripts
│   ├── build.js
│   ├── deploy.js
│   └── seed-database.js
├── 📋 app.json                       # Expo configuration
├── 📋 package.json                   # Dependencies
├── 📋 tsconfig.json                  # TypeScript config
├── 📋 metro.config.js                # Metro bundler config
├── 📋 babel.config.js                # Babel configuration
├── 📋 .env.example                   # Environment variables example
├── 📋 .gitignore                     # Git ignore rules
└── 📋 README.md                      # Project README
```

### Key Directory Explanations

#### `/app` - Expo Router Structure
- Uses file-based routing with TypeScript
- Groups related screens with parentheses `(auth)`, `(tabs)`
- Dynamic routes with brackets `[id].tsx`
- Layout files for shared UI components

#### `/components` - Component Organization
- `/ui` - Basic Material 3 design system components
- `/forms` - Complex form components with validation
- `/charts` - Data visualization components
- `/ai` - AI-specific UI components
- `/community` - Social feature components

#### `/lib` - Core Application Logic
- `/supabase` - Backend integration and types
- `/i18n` - Internationalization with English and Chinese support
- `/ai` - AI service integrations and utilities
- `/database` - Local database models and sync logic
- `/storage` - File upload and cloud storage
- `/cache` - Intelligent caching system
- `/utils` - Shared utility functions
- `/hooks` - Custom React hooks for state management

#### `/constants` - Configuration and Data
- Color schemes, species data, parameter ranges
- AI model configurations and prompts
- App-wide constants and enums

---

## 🎨 UI/UX Design (Material 3)

### Design Philosophy
- **Accessibility First**: Support for screen readers, high contrast, large text
- **Offline-First**: Graceful degradation when offline
- **Data-Dense but Clean**: Show important information without clutter
- **Progressive Disclosure**: Advanced features hidden until needed
- **Multi-Language Support**: Seamless language switching between English and Chinese

### Navigation Structure

#### Bottom Navigation (Primary)
```typescript
const BottomTabs = {
  Home: {
    icon: 'home',
    activeIcon: 'home-filled',
    label: 'Home'
  },
  Tanks: {
    icon: 'aquarium',
    activeIcon: 'aquarium-filled', 
    label: 'Tanks'
  },
  Diagnose: {
    icon: 'medical-bag',
    activeIcon: 'medical-bag-filled',
    label: 'Diagnose'
  },
  Encyclopedia: {
    icon: 'book-open',
    activeIcon: 'book-open-filled',
    label: 'Learn'
  },
  Profile: {
    icon: 'person',
    activeIcon: 'person-filled',
    label: 'Profile'
  }
}
```

#### Color System
```typescript
const ColorScheme = {
  light: {
    primary: '#006A6B',           // Teal primary
    onPrimary: '#FFFFFF',
    primaryContainer: '#9CF0F0',
    onPrimaryContainer: '#002020',
    secondary: '#4A6363',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#CCE8E8',
    onSecondaryContainer: '#051F1F',
    tertiary: '#456179',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#CCE5FF',
    onTertiaryContainer: '#001E31',
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    background: '#FAFDFC',
    onBackground: '#191C1C',
    surface: '#FAFDFC',
    onSurface: '#191C1C',
    surfaceVariant: '#DAE5E4',
    onSurfaceVariant: '#3F4948'
  },
  dark: {
    primary: '#70D4D4',
    onPrimary: '#003737',
    primaryContainer: '#004F4F',
    onPrimaryContainer: '#9CF0F0',
    secondary: '#B1CCCC',
    onSecondary: '#1C3535',
    secondaryContainer: '#324B4B',
    onSecondaryContainer: '#CCE8E8',
    tertiary: '#A4C9E1',
    onTertiary: '#0A344A',
    tertiaryContainer: '#254B61',
    onTertiaryContainer: '#CCE5FF',
    error: '#FFB4AB',
    errorContainer: '#93000A',
    background: '#0F1415',
    onBackground: '#DEE4E3',
    surface: '#0F1415',
    onSurface: '#DEE4E3',
    surfaceVariant: '#3F4948',
    onSurfaceVariant: '#BEC9C8'
  }
}
```

### Screen Layouts

#### Home Screen Components
```typescript
const HomeScreenLayout = {
  header: {
    title: 'AquaMind',
    actions: ['notifications', 'settings']
  },
  sections: [
    {
      type: 'ai-tip-card',
      title: 'AI Tip of the Day',
      elevated: true
    },
    {
      type: 'water-quality-snapshot',
      title: 'Water Quality Overview',
      expandable: true
    },
    {
      type: 'reminders-list',
      title: 'Upcoming Reminders',
      maxItems: 3
    },
    {
      type: 'featured-species',
      title: 'Fish of the Week',
      carousel: true
    }
  ]
}
```

#### Tank Dashboard Layout
```typescript
const TankDashboardLayout = {
  header: {
    title: 'My Tanks',
    actions: ['add-tank', 'filter']
  },
  sections: [
    {
      type: 'tank-grid',
      columns: 2,
      showHealthIndicators: true
    },
    {
      type: 'quick-log-fab',
      actions: ['water-test', 'feeding', 'maintenance']
    }
  ]
}
```

### Component Specifications

#### Tank Card Component
```typescript
interface TankCardProps {
  tank: Tank;
  healthStatus: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdate: Date;
  quickActions: boolean;
}

const TankCard = styled(Card)`
  elevation: 2;
  margin: 8px;
  borderRadius: 16px;
  
  .health-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 12px;
    height: 12px;
    borderRadius: 6px;
  }
  
  .tank-image {
    height: 120px;
    borderTopLeftRadius: 16px;
    borderTopRightRadius: 16px;
  }
  
  .tank-info {
    padding: 16px;
  }
  
  .quick-actions {
    flexDirection: row;
    justifyContent: space-around;
    paddingTop: 8px;
  }
`;
```

---

## 🧪 Development Mode

### Free Access Period
- **Duration**: Development phase + 6 months post-launch
- **Features**: All premium features unlocked
- **Purpose**: User acquisition and feature validation
- **Data Collection**: Anonymous usage analytics (with consent)

### Data Collection Strategy
```typescript
interface UsageAnalytics {
  feature_usage: {
    ai_diagnosis_count: number;
    water_test_frequency: number;
    feeding_log_count: number;
    community_posts: number;
  };
  tank_demographics: {
    tank_types: string[];
    fish_species: string[];
    experience_levels: string[];
  };
  performance_metrics: {
    app_crashes: number;
    ai_response_times: number[];
    offline_usage_duration: number;
  };
}
```

### Optimization Features
- **Bandwidth Reduction**: Image compression, data pagination
- **Offline Support**: Local SQLite cache, sync queues
- **Smart Caching**: Predictive content loading
- **Battery Optimization**: Background task management

---

## 🔄 Update System

### GitHub-Based Updates

#### Version Management
```typescript
interface AppVersion {
  current: string;          // e.g., "1.2.3"
  latest: string;           // From GitHub API
  releaseNotes: string;
  downloadUrl: string;
  isForced: boolean;        // Critical security update
  minimumSupported: string; // Oldest compatible version
}
```

#### Update Flow
1. **Background Check**: Every app launch + daily scheduled check
2. **User Notification**: Non-intrusive snackbar for optional updates
3. **Forced Updates**: Modal dialog for critical security updates
4. **Download**: Direct APK download or Expo Updates OTA

#### Implementation
```typescript
const UpdateChecker = {
  checkForUpdates: async () => {
    const response = await fetch('https://api.github.com/repos/user/aquamind/releases/latest');
    const release = await response.json();
    return {
      version: release.tag_name,
      notes: release.body,
      downloadUrl: release.assets[0].browser_download_url,
      publishedAt: release.published_at
    };
  },
  
  promptUpdate: (updateInfo: UpdateInfo) => {
    // Show Material 3 dialog or snackbar
  },
  
  installUpdate: async (url: string) => {
    // Platform-specific installation
  }
};
```

---

## 💾 Cache System

### Intelligent Caching Strategy

#### Cache Categories
```typescript
interface CacheCategories {
  essential: {
    userProfiles: LocalUser[];
    tankData: LocalTank[];
    recentLogs: WaterParameter[];
  };
  
  content: {
    speciesImages: CachedImage[];
    encyclopediaEntries: SpeciesData[];
    communityPosts: CachedPost[];
  };
  
  ai_data: {
    diagnosisHistory: AIAnalysis[];
    recommendations: AIRecommendation[];
    modelCache: MLModelCache;
  };
}
```

#### Cache Management UI
```typescript
const CacheSettingsScreen = {
  sections: [
    {
      title: 'Storage Overview',
      component: 'StorageProgressCard',
      data: {
        used: '245 MB',
        available: '2.1 GB',
        breakdown: {
          photos: '156 MB',
          logs: '45 MB', 
          offline_content: '44 MB'
        }
      }
    },
    {
      title: 'Cache Settings',
      items: [
        {
          type: 'toggle',
          label: 'Smart Caching',
          description: 'Automatically cache frequently used content',
          value: true
        },
        {
          type: 'toggle', 
          label: 'WiFi Only Sync',
          description: 'Only sync when connected to WiFi',
          value: true
        },
        {
          type: 'slider',
          label: 'Cache Size Limit',
          description: 'Maximum storage for cached content',
          value: 500, // MB
          min: 100,
          max: 2000
        }
      ]
    },
    {
      title: 'Actions',
      items: [
        {
          type: 'button',
          label: 'Clear Image Cache',
          description: 'Remove cached photos and images',
          action: 'clear_images'
        },
        {
          type: 'button',
          label: 'Clear All Cache', 
          description: 'Remove all cached data',
          action: 'clear_all',
          confirmDialog: true
        }
      ]
    }
  ]
};
```

#### Sync Strategy
```typescript
const SyncManager = {
  priorities: {
    high: ['water_parameters', 'health_records', 'reminders'],
    medium: ['feeding_logs', 'maintenance_logs', 'fish_updates'],
    low: ['community_posts', 'species_data', 'user_preferences']
  },
  
  conditions: {
    wifi_only: true,
    battery_level: 20, // minimum %
    storage_available: 100 // minimum MB
  },
  
  queue: 'sync_queue' // database table
};
```

---

## 💰 Monetization Plan

### Tier Structure (Post-Development)

#### Free Tier (Always Available)
- ✅ 2 tanks maximum
- ✅ Basic water parameter logging
- ✅ Manual feeding reminders
- ✅ Species encyclopedia (limited)
- ✅ Community access (view only)
- ✅ Basic health tracking

#### Pro Tier ($4.99/month)
- ✅ Unlimited tanks
- ✅ AI-powered health diagnosis
- ✅ Advanced water quality predictions
- ✅ Smart feeding recommendations
- ✅ Full encyclopedia access
- ✅ Community posting and commenting
- ✅ Priority customer support

#### Premium Tier ($9.99/month)
- ✅ Everything in Pro
- ✅ AR tank preview (future)
- ✅ Expert consultation scheduling
- ✅ Advanced analytics and insights
- ✅ Custom AI training on your data
- ✅ White-label option for stores
- ✅ API access for integrations

### Revenue Projections
```typescript
interface RevenueModel {
  year1: {
    free_users: 10000,
    pro_users: 800,      // 8% conversion
    premium_users: 200,   // 2% conversion
    monthly_revenue: 6800 // $4.99 × 800 + $9.99 × 200
  };
  
  year2: {
    free_users: 25000,
    pro_users: 2500,
    premium_users: 750,
    monthly_revenue: 19975
  };
  
  additional_revenue: {
    affiliate_commissions: 500,  // Equipment recommendations
    premium_content: 200,        // Expert guides
    api_licensing: 1000          // B2B integrations
  };
}
```

---

## 🚀 Next Steps

### Phase 1: Foundation (Weeks 1-4)
- [ ] Set up Expo project with TypeScript
- [ ] Configure Supabase backend
- [ ] Implement authentication system
- [ ] Create basic UI components (Material 3)
- [ ] Set up local database with WatermelonDB

### Phase 2: Core Features (Weeks 5-8) 
- [ ] Tank management CRUD operations
- [ ] Water parameter logging and visualization
- [ ] Fish management system
- [ ] Basic reminders and notifications
- [ ] Offline functionality and sync

### Phase 3: AI Integration (Weeks 9-12)
- [ ] Integrate computer vision API for fish health
- [ ] Implement AI recommendation engine
- [ ] Add symptom-based diagnosis
- [ ] Water quality prediction system

### Phase 4: Advanced Features (Weeks 13-16)
- [ ] Community features and social aspects
- [ ] Encyclopedia with search and filters
- [ ] Advanced analytics and insights
- [ ] Cache optimization and performance tuning

### Phase 5: Polish & Launch (Weeks 17-20)
- [ ] Comprehensive testing and bug fixes
- [ ] App store preparation and submission
- [ ] Documentation and user guides
- [ ] Marketing and launch strategy

---

## 📝 Development Notes

### Key Considerations
- **Performance**: Optimize for older Android devices (API level 21+)
- **Accessibility**: Follow WCAG 2.1 AA guidelines
- **Internationalization**: Support for English and Chinese languages with proper text rendering
- **Compliance**: GDPR compliance for EU users, COPPA for under-13 users
- **Cultural Adaptation**: Region-specific content and cultural considerations for Chinese users

### Technical Debt Prevention
- Regular code reviews and pair programming
- Automated testing with 80%+ coverage
- Performance monitoring and optimization
- Security audits and penetration testing

### Community Building
- Beta testing program with experienced fishkeepers
- Social media presence and content marketing
- Partnerships with aquarium stores and veterinarians
- Open-source contributions and transparency
- Multi-language community management and support
- Region-specific marketing for English and Chinese speaking markets

---

*Last updated: July 10, 2025*
*Version: 1.0.0*
*Status: Development*