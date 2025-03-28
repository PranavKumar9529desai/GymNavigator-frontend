import { create } from 'zustand';

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export interface MedicalCondition {
  id: string;
  name: string;
  selected: boolean;
}

export interface HealthProfileState {
  // Form data
  gender: Gender | null;
  age: number | null;
  activityLevel: ActivityLevel | null;
  height: { value: number | null; unit: 'cm' | 'ft' };
  weight: { value: number | null; unit: 'kg' | 'lb' };
  targetWeight: { value: number | null; unit: 'kg' | 'lb' };
  medicalConditions: MedicalCondition[];
  otherMedicalCondition: string;
  
  // Form navigation
  currentStep: number;
  totalSteps: number;

  // Actions
  setGender: (gender: Gender) => void;
  setAge: (age: number) => void;
  setActivityLevel: (level: ActivityLevel) => void;
  setHeight: (value: number, unit: 'cm' | 'ft') => void;
  setWeight: (value: number, unit: 'kg' | 'lb') => void;
  setTargetWeight: (value: number, unit: 'kg' | 'lb') => void;
  toggleMedicalCondition: (id: string) => void;
  addMedicalCondition: (condition: string) => void;
  setOtherMedicalCondition: (text: string) => void;
  
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
}

export const defaultMedicalConditions: MedicalCondition[] = [
  { id: '1', name: 'Diabetes', selected: false },
  { id: '2', name: 'Hypertension', selected: false },
  { id: '3', name: 'Heart Disease', selected: false },
  { id: '4', name: 'Asthma', selected: false },
  { id: '5', name: 'Arthritis', selected: false },
  { id: '6', name: 'Back Pain', selected: false },
  { id: '7', name: 'None', selected: false },
];

export const useHealthProfileStore = create<HealthProfileState>((set) => ({
  // Initial state
  gender: null,
  age: null,
  activityLevel: null,
  height: { value: null, unit: 'cm' },
  weight: { value: null, unit: 'kg' },
  targetWeight: { value: null, unit: 'kg' },
  medicalConditions: [...defaultMedicalConditions],
  otherMedicalCondition: '',
  
  currentStep: 1,
  totalSteps: 7,

  // Actions
  setGender: (gender) => set({ gender }),
  
  setAge: (age) => set({ age }),
  
  setActivityLevel: (activityLevel) => set({ activityLevel }),
  
  setHeight: (value, unit) => set({ height: { value, unit } }),
  
  setWeight: (value, unit) => set({ weight: { value, unit } }),
  
  setTargetWeight: (value, unit) => set({ targetWeight: { value, unit } }),
  
  toggleMedicalCondition: (id) => set((state) => ({
    medicalConditions: state.medicalConditions.map(condition =>
      condition.id === id
        ? { ...condition, selected: !condition.selected }
        // If selecting "None", unselect all others, and vice versa
        : (id === '7' || condition.id === '7')
          ? { ...condition, selected: false }
          : condition
    )
  })),
  
  addMedicalCondition: (condition) => set((state) => ({
    medicalConditions: [
      ...state.medicalConditions,
      { id: `custom-${Date.now()}`, name: condition, selected: true }
    ]
  })),
  
  setOtherMedicalCondition: (text) => set({ otherMedicalCondition: text }),
  
  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, state.totalSteps)
  })),
  
  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),
  
  goToStep: (step) => set({ currentStep: step }),
  
  resetForm: () => set({
    gender: null,
    age: null,
    activityLevel: null,
    height: { value: null, unit: 'cm' },
    weight: { value: null, unit: 'kg' },
    targetWeight: { value: null, unit: 'kg' },
    medicalConditions: [...defaultMedicalConditions],
    otherMedicalCondition: '',
    currentStep: 1
  })
}));
