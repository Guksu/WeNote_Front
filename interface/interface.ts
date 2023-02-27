export interface HomeProjectList {
  PRO_ID: number;
  PRO_CATEGORY: string;
  PRO_IMG: string;
  PRO_TITLE: string;
  PRO_CONTENT: string;
  PRO_REG__DT: string;
}

export interface ProjectDetail {
  PRO_CATEGORY: string;
  PRO_IMG: string;
  PRO_TITLE: string;
  PRO_CONTENT: string;
  PRO_REG__DT: string;
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
