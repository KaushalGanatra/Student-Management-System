import * as Yup from 'yup';

export type Student = {
    id?: string;
    name: string;
    class: string;
    division: string;
    gender: string;
};

export type Class = {
    id: string;
    classNumber: string;
}

export type Division = {
    id: string;
    divisionName: string;
}

export type AttendenceData = {
    id: string;
    attendenceDate: string;
    studentId: string;
    isPresent: boolean;
    [key: string]: boolean | string;
}

export const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    class: Yup.string().required('Class is required'),
    division: Yup.string().required('Division is required'),
    gender: Yup.string().required('Gender is required'),
  });
  
export interface ListProps {
    students: Student[];
    filteredStudents: Student[];
    loading: boolean;
    handleOpen: (student: Student) => void;
    handleDelete: (id: string) => void;
    showConformation: boolean;
    handleClose: () => void;
    studentToDelete: Student | null;
  }

  export interface ConfirmationModalProps {
    show: boolean;
    studentToDelete: any; 
    handleClose: () => void;
    handleDelete: (id: string) => void;
    handleSubmission: () => void;
    message: string; 
    actionLabel: string; 
  }