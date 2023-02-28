export interface ProjectList {
  PRO_ID: number;
  PRO_CATEGORY: string;
  PRO_IMG: string;
  PRO_TITLE: string;
  PRO_CONTENT: string;
  PRO_REG_DT: string;
  PRO_STATE?: string;
}

export interface ProjectDetail {
  PRO_CATEGORY: string;
  PRO_IMG: string;
  PRO_TITLE: string;
  PRO_CONTENT: string;
  PRO_REG__DT: string;
  PRO_STATE: string;
  MEMBER_CHECK: string;
}

export interface ProfileInfo {
  MEM_NICK: string;
  MEM_EMAIL: string;
  MEM_IMG: string;
}

export interface NoteList {
  NOTE_ID: number;
  NOTE_TITLE: string;
  NOTE_STATE: string;
  NOTE_REG_DT: string;
  NOTE_CONTENT: string;
}

export interface ProjectNoteList {
  MEM_ID: number;
  PRO_NOTE_ID: number;
  PRO_NOTE_TITLE: string;
  PRO_NOTE_STATE: string;
  PRO_NOTE_CONTENT: string;
  PRO_NOTE_REG_DT: string;
  MEM_NICK: string;
  MEM_IMG: string;
  ISOWNER: string;
}

export interface ProjectMemberList {
  MEM_ID: number;
  MEM_NICK: string;
  MEM_IMG: string;
  PRO_MEM_ROLE: string;
}
