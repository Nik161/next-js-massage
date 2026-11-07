import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UiState = {
  isMobileMenuOpen: boolean;
  // Solid header background after a bit of scrolling
  isHeaderScrolled: boolean;
  // Header slides away while scrolling down
  isHeaderHidden: boolean;
  isIntroShown: boolean;
  // The store lives for the whole page load, so the curtain only plays on a
  // full load, not on client-side navigation back to the landing page.
  hasIntroPlayed: boolean;
  // Only one modal can be open, so a single id is enough
  openModalId: string | null;
};

const initialState: UiState = {
  isMobileMenuOpen: false,
  isHeaderScrolled: false,
  isHeaderHidden: false,
  isIntroShown: true,
  hasIntroPlayed: false,
  openModalId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    mobileMenuToggled: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    mobileMenuClosed: (state) => {
      state.isMobileMenuOpen = false;
    },
    headerScrolled: (
      state,
      action: PayloadAction<{ isScrolled: boolean; isHidden: boolean }>,
    ) => {
      state.isHeaderScrolled = action.payload.isScrolled;
      state.isHeaderHidden = action.payload.isHidden;
    },
    introStarted: (state) => {
      state.hasIntroPlayed = true;
    },
    introHidden: (state) => {
      state.isIntroShown = false;
    },
    modalOpened: (state, action: PayloadAction<string>) => {
      state.openModalId = action.payload;
    },
    // Takes the id, so a modal can only close itself
    modalClosed: (state, action: PayloadAction<string>) => {
      if (state.openModalId === action.payload) state.openModalId = null;
    },
  },
  selectors: {
    selectIsMobileMenuOpen: (state) => state.isMobileMenuOpen,
    selectIsHeaderScrolled: (state) => state.isHeaderScrolled,
    selectIsHeaderHidden: (state) => state.isHeaderHidden,
    selectIsIntroShown: (state) => state.isIntroShown,
    selectHasIntroPlayed: (state) => state.hasIntroPlayed,
    selectOpenModalId: (state) => state.openModalId,
  },
});

export const {
  mobileMenuToggled,
  mobileMenuClosed,
  headerScrolled,
  introStarted,
  introHidden,
  modalOpened,
  modalClosed,
} = uiSlice.actions;

export const {
  selectIsMobileMenuOpen,
  selectIsHeaderScrolled,
  selectIsHeaderHidden,
  selectIsIntroShown,
  selectHasIntroPlayed,
  selectOpenModalId,
} = uiSlice.selectors;

export default uiSlice;
