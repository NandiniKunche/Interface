import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import {
  Patient,
  Doctor,
  Visit,
  Prescription,
  User,
  AuthState,
  DEMO_CREDENTIALS,
  SeverityChange,
} from "@/types/hospital";
import { toast } from "sonner";
import {
  PatientAPI,
  DoctorAPI,
  VisitAPI,
  PrescriptionAPI,
} from "@/services/api";

/* =======================
   STATE & TYPES
======================= */

interface HospitalState {
  patients: Patient[];
  doctors: Doctor[];
  visits: Visit[];
  prescriptions: Prescription[];
  auth: AuthState;
}

type HospitalAction =
  | { type: "SET_PATIENTS"; payload: Patient[] }
  | { type: "SET_DOCTORS"; payload: Doctor[] }
  | { type: "SET_VISITS"; payload: Visit[] }
  | { type: "SET_PRESCRIPTIONS"; payload: Prescription[] }
  | { type: "ADD_PATIENT"; payload: Patient }
  | { type: "ADD_PATIENTS"; payload: Patient[] }
  | { type: "DELETE_PATIENT"; payload: string }
  | { type: "ADD_DOCTOR"; payload: Doctor }
  | { type: "ADD_DOCTORS"; payload: Doctor[] }
  | { type: "DELETE_DOCTOR"; payload: string }
  | { type: "ADD_VISIT"; payload: Visit }
  | { type: "ADD_VISITS"; payload: Visit[] }
  | { type: "DELETE_VISIT"; payload: string }
  | { type: "ADD_PRESCRIPTION"; payload: Prescription }
  | { type: "ADD_PRESCRIPTIONS"; payload: Prescription[] }
  | { type: "DELETE_PRESCRIPTION"; payload: string }
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" };

const initialState: HospitalState = {
  patients: [],
  doctors: [],
  visits: [],
  prescriptions: [],
  auth: { user: null, isAuthenticated: false },
};

/* =======================
   REDUCER
======================= */

function hospitalReducer(
  state: HospitalState,
  action: HospitalAction
): HospitalState {
  switch (action.type) {
    case "SET_PATIENTS":
      return { ...state, patients: action.payload };

    case "SET_DOCTORS":
      return { ...state, doctors: action.payload };

    case "SET_VISITS":
      return { ...state, visits: action.payload };

    case "SET_PRESCRIPTIONS":
      return { ...state, prescriptions: action.payload };

    case "ADD_PATIENT":
      return { ...state, patients: [...state.patients, action.payload] };

    case "ADD_PATIENTS":
      return { ...state, patients: [...state.patients, ...action.payload] };

    case "DELETE_PATIENT":
      return {
        ...state,
        patients: state.patients.filter(
          (p) => p.patient_id !== action.payload
        ),
      };

    case "ADD_DOCTOR":
      return { ...state, doctors: [...state.doctors, action.payload] };

    case "ADD_DOCTORS":
      return { ...state, doctors: [...state.doctors, ...action.payload] };

    case "DELETE_DOCTOR":
      return {
        ...state,
        doctors: state.doctors.filter(
          (d) => d.doctor_id !== action.payload
        ),
      };

    case "ADD_VISIT":
      return { ...state, visits: [...state.visits, action.payload] };

    case "ADD_VISITS":
      return { ...state, visits: [...state.visits, ...action.payload] };

    case "DELETE_VISIT":
      return {
        ...state,
        visits: state.visits.filter((v) => v.visit_id !== action.payload),
      };

    case "ADD_PRESCRIPTION":
      return {
        ...state,
        prescriptions: [...state.prescriptions, action.payload],
      };

    case "ADD_PRESCRIPTIONS":
      return {
        ...state,
        prescriptions: [...state.prescriptions, ...action.payload],
      };

    case "DELETE_PRESCRIPTION":
      return {
        ...state,
        prescriptions: state.prescriptions.filter(
          (p) => p.prescription_id !== action.payload
        ),
      };

    case "LOGIN":
      return {
        ...state,
        auth: { user: action.payload, isAuthenticated: true },
      };

    case "LOGOUT":
      return { ...state, auth: { user: null, isAuthenticated: false } };

    default:
      return state;
  }
}

/* =======================
   CONTEXT
======================= */

interface HospitalContextType {
  state: HospitalState;

  addPatients: (patients: Patient[]) => void;
  deletePatient: (patientId: string) => Promise<void>;

  addDoctors: (doctors: Doctor[]) => void;
  deleteDoctor: (doctorId: string) => Promise<void>;

  addVisits: (visits: Visit[]) => void;
  deleteVisit: (visitId: string) => Promise<void>;

  addPrescriptions: (prescriptions: Prescription[]) => void;
  deletePrescription: (prescriptionId: string) => Promise<void>;

  login: (
    userId: string,
    password: string,
    portal: "admin" | "doctor"
  ) => { success: boolean; error?: string };

  logout: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(
  undefined
);

/* =======================
   PROVIDER
======================= */

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(hospitalReducer, initialState);

  /* ===== FETCH INITIAL DATA ===== */

  useEffect(() => {
    PatientAPI.getAll().then((data) =>
      dispatch({ type: "SET_PATIENTS", payload: data })
    );
    DoctorAPI.getAll().then((data) =>
      dispatch({ type: "SET_DOCTORS", payload: data })
    );
    VisitAPI.getAll().then((data) =>
      dispatch({ type: "SET_VISITS", payload: data })
    );
    PrescriptionAPI.getAll().then((data) =>
      dispatch({ type: "SET_PRESCRIPTIONS", payload: data })
    );
  }, []);

  /* ===== ADD ===== */

  const addPatients = useCallback((patients: Patient[]) => {
    dispatch({ type: "ADD_PATIENTS", payload: patients });
  }, []);

  const addDoctors = useCallback((doctors: Doctor[]) => {
    dispatch({ type: "ADD_DOCTORS", payload: doctors });
  }, []);

  const addVisits = useCallback((visits: Visit[]) => {
    dispatch({ type: "ADD_VISITS", payload: visits });
  }, []);

  const addPrescriptions = useCallback((prescriptions: Prescription[]) => {
    dispatch({ type: "ADD_PRESCRIPTIONS", payload: prescriptions });
  }, []);

  /* ===== DELETE (FIXED) ===== */

  const deletePatient = useCallback(async (patientId: string) => {
    await PatientAPI.delete(patientId);
    dispatch({ type: "DELETE_PATIENT", payload: patientId });
    toast.success("Patient deleted");
  }, []);

  const deleteDoctor = useCallback(async (doctorId: string) => {
    await DoctorAPI.delete(doctorId);
    dispatch({ type: "DELETE_DOCTOR", payload: doctorId });
    toast.success("Doctor deleted");
  }, []);

  const deleteVisit = useCallback(async (visitId: string) => {
    await VisitAPI.delete(visitId);
    dispatch({ type: "DELETE_VISIT", payload: visitId });
    toast.success("Visit deleted");
  }, []);

  const deletePrescription = useCallback(async (prescriptionId: string) => {
    await PrescriptionAPI.delete(prescriptionId);
    dispatch({
      type: "DELETE_PRESCRIPTION",
      payload: prescriptionId,
    });
    toast.success("Prescription deleted");
  }, []);

  /* ===== AUTH ===== */

  const login = useCallback(
    (userId: string, password: string, portal: "admin" | "doctor") => {
      if (
        portal === "admin" &&
        userId === DEMO_CREDENTIALS.admin.user_id &&
        password === DEMO_CREDENTIALS.admin.password
      ) {
        dispatch({
          type: "LOGIN",
          payload: { user_id: userId, role: "admin" },
        });
        return { success: true };
      }

      return { success: false, error: "Invalid credentials" };
    },
    []
  );

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <HospitalContext.Provider
      value={{
        state,
        addPatients,
        deletePatient,
        addDoctors,
        deleteDoctor,
        addVisits,
        deleteVisit,
        addPrescriptions,
        deletePrescription,
        login,
        logout,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used inside HospitalProvider");
  }
  return context;
}
