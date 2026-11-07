import React, { useState } from 'react';
import { User, Settings, Database, LogIn, LogOut, Shield, Leaf, Award, ExternalLink } from 'lucide-react';
import { UserProfile } from '../../types/fabric';
import { SettingsModal } from './SettingsModal';
import { DeveloperModal } from '../developer/DeveloperModal';
import { loginWithGoogle, logoutUser } from '../../services/firebase';

interface ProfileScreenProps {
  user: UserProfile;
  scanCount: number;
  onUserUpdated: (user: UserProfile) => void;
  onHistoryCleared: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  scanCount,
  onUserUpdated,
  onHistoryCleared,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDeveloper, setShowDeveloper] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const updated = await loginWithGoogle();
      onUserUpdated(updated);
    } catch (e) {
      console.warn('Sign-in error:', e);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    onUserUpdated({
      id: 'guest_' + Math.random().toString(36).substring(2, 9),
      name: 'Guest Explorer',
      email: 'guest@fabricai.local',
      isGuest: true,
      scanCount: 0,
      joinedDate: 'Current Session'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onHistoryCleared={onHistoryCleared}
        />
      )}

      {showDeveloper && (
        <DeveloperModal onClose={() => setShowDeveloper(false)} />
      )}

      {/* Profile Header Card */}
      <div className="p-5 rounded-2xl bg-canvas-card border border-tan/60 shadow-lift relative overflow-hidden">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-canvas-deep border-2 border-tan flex items-center justify-center overflow-hidden flex-shrink-0 shadow-soft">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-ink-soft" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-lg text-ink truncate">
                {user.name}
              </h2>
              {user.isGuest ? (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-tan/30 text-ink-soft">
                  Guest
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-eco-bg text-eco border border-eco-border/40">
                  Verified
                </span>
              )}
            </div>

            <p className="text-xs text-ink-light truncate mt-0.5">
              {user.email}
            </p>

            <span className="text-[10px] text-ink-soft block mt-1">
              Member since: {user.joinedDate}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-tan/40 text-center">
          <div className="p-2 rounded-xl bg-canvas-deep/50">
            <span className="text-[10px] uppercase font-bold text-ink-light block">
              Total Scans
            </span>
            <span className="font-serif font-bold text-xl text-ink">
              {scanCount}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-canvas-deep/50">
            <span className="text-[10px] uppercase font-bold text-ink-light block">
              Conscious Level
            </span>
            <span className="font-serif font-bold text-base text-eco flex items-center justify-center gap-1">
              <Leaf className="w-3.5 h-3.5" />
              {scanCount >= 5 ? 'Eco Champion' : 'Explorer'}
            </span>
          </div>
        </div>
      </div>

      {/* Account Mode Notice */}
      {user.isGuest && (
        <div className="p-4 rounded-xl bg-rust-light/50 border border-rust/30 flex items-start gap-3">
          <Shield className="w-4 h-4 text-rust flex-shrink-0 mt-0.5" />
          <div className="text-xs text-ink-soft leading-relaxed flex-1">
            <span className="font-bold text-ink block mb-0.5">Guest Mode Active</span>
            You can detect fabrics without signing in. Sign in if you want to sync your history across devices.
          </div>
        </div>
      )}

      {/* Menu Options */}
      <div className="space-y-2.5">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full p-3.5 rounded-xl bg-canvas-card border border-tan/50 hover:border-tan shadow-tag flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-canvas-deep flex items-center justify-center text-ink-soft group-hover:text-ink">
              <Settings className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-xs text-ink block">Settings & Privacy</span>
              <span className="text-[10px] text-ink-light">Preferences, storage & about</span>
            </div>
          </div>
          <span className="text-ink-light group-hover:text-ink font-bold text-sm">&rarr;</span>
        </button>

        <button
          onClick={() => setShowDeveloper(true)}
          className="w-full p-3.5 rounded-xl bg-canvas-card border border-tan/50 hover:border-tan shadow-tag flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rust/10 flex items-center justify-center text-rust">
              <Database className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-xs text-ink block">Developer & Dataset Tools</span>
              <span className="text-[10px] text-ink-light">Model specs, Google Drive dataset sync</span>
            </div>
          </div>
          <span className="text-ink-light group-hover:text-rust font-bold text-sm">&rarr;</span>
        </button>
      </div>

      {/* Auth Action */}
      <div className="pt-2">
        {user.isGuest ? (
          <button
            onClick={handleSignIn}
            disabled={isAuthenticating}
            className="w-full py-3.5 rounded-xl bg-ink text-canvas font-semibold text-xs hover:bg-rust transition-colors shadow-soft flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isAuthenticating ? 'Signing in...' : 'Sign in with Firebase / Google'}</span>
          </button>
        ) : (
          <button
            onClick={handleSignOut}
            className="w-full py-3.5 rounded-xl border border-rust/40 text-rust font-semibold text-xs hover:bg-rust-light/40 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};
