import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

export const ScoreBadge = ({ score, status, size = 'md', label }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'VERIFIED':
      case 'LOW':
      case 'ELIGIBLE':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: ShieldCheck,
          iconColor: 'text-emerald-600',
          text: status === 'VERIFIED' ? 'Verified' : status === 'LOW' ? 'Low Risk' : 'Eligible'
        };
      case 'NEEDS_VERIFICATION':
      case 'MEDIUM':
      case 'POTENTIALLY_ELIGIBLE':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          text: status === 'NEEDS_VERIFICATION' ? 'Needs Verification' : status === 'MEDIUM' ? 'Medium Risk' : 'Potentially Eligible'
        };
      case 'HIGH_RISK':
      case 'HIGH':
      case 'NOT_ELIGIBLE':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          icon: XCircle,
          iconColor: 'text-rose-600',
          text: status === 'HIGH_RISK' ? 'High Risk Scam' : status === 'HIGH' ? 'High Risk' : 'Not Eligible'
        };
      case 'VERIFICATION_UNAVAILABLE':
      default:
        return {
          bg: 'bg-gray-50 text-gray-700 border-gray-300',
          icon: HelpCircle,
          iconColor: 'text-gray-500',
          text: 'Verification Unavailable'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2 gap-1',
    md: 'text-xs py-1 px-2.5 gap-1.5',
    lg: 'text-sm py-1.5 px-3.5 gap-2 font-semibold'
  };

  return (
    <div className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${sizeClasses[size] || sizeClasses.md}`}>
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
      <span>{label || config.text}</span>
      {score !== undefined && score !== null && (
        <span className="ml-1 font-bold font-mono opacity-90">({score})</span>
      )}
    </div>
  );
};
