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
    classNumber: number;
}

export type Division = {
    id: string;
    divisionName: string;
}

export type AttendenceData = {
    id: string;
    attendenceDate: Date;
    studentId: string;
    isPresent: boolean;
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

 export interface DeleteConfirmationModalProps {
    show: boolean;
    studentToDelete: Student | null;
    handleClose: () => void;
    handleDelete: (id: string) => void;
  }