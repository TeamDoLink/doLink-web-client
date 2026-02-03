import { create } from 'zustand';

export type ModalType = 'alert' | 'confirm';

export type AlertConfig = {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

export type ConfirmConfig = {
  title: string;
  subtitle?: string;
  positiveLabel: string;
  negativeLabel?: string;
  onPositive?: () => void;
  onNegative?: () => void;
};

type ModalStoreState = {
  isOpen: boolean;
  type: ModalType | null;
  alertConfig: AlertConfig | null;
  confirmConfig: ConfirmConfig | null;
  openAlert: (config: AlertConfig) => void;
  openConfirm: (config: ConfirmConfig) => void;
  close: () => void;
};

export const useModalStore = create<ModalStoreState>((set) => ({
  isOpen: false,
  type: null,
  alertConfig: null,
  confirmConfig: null,
  openAlert: (config) =>
    set({
      isOpen: true,
      type: 'alert',
      alertConfig: config,
      confirmConfig: null,
    }),
  openConfirm: (config) =>
    set({
      isOpen: true,
      type: 'confirm',
      confirmConfig: config,
      alertConfig: null,
    }),
  close: () =>
    set({
      isOpen: false,
      type: null,
      alertConfig: null,
      confirmConfig: null,
    }),
}));

export default useModalStore;
