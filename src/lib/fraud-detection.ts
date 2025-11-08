/**
 * Fraud Detection System
 */

import { getAdminClient } from './supabase/admin';

type FraudSeverity = 'low' | 'medium' | 'high';

interface FraudCheckParams {
  ipAddress: string;
  phoneE164?: string;
  normalizedName?: string;
  dob?: string;
  deviceFingerprint?: string;
}

interface FraudCheckResult {
  isSuspicious: boolean;
  severity: FraudSeverity;
  reasons: string[];
  score: number;
}

/**
 * Check for fraudulent activity
 */
export async function checkFraudActivity(
  params: FraudCheckParams
): Promise<FraudCheckResult> {
  const reasons: string[] = [];
  let score = 0;
  
  const supabase = getAdminClient();
  
  // Check 1: Same IP, multiple recent votes (within 1 hour)
  const { data: ipVotes } = await supabase
    .from('votes')
    .select('id, created_at')
    .eq('submitted_ip', params.ipAddress)
    .gte('created_at', new Date(Date.now() - 3600000).toISOString());
  
  if (ipVotes && ipVotes.length >= 3) {
    reasons.push('Multiple votes from same IP');
    score += 30;
  }
  
  // Check 2: Same phone, multiple OTP attempts
  // @ts-ignore - private schema access via admin client
  const { data: otpAttempts } = await supabase.schema('private')
    .from('otps')
    .select('id, created_at, attempts')
    .eq('phone_e164', params.phoneE164)
    .gte('created_at', new Date(Date.now() - 3600000).toISOString());
  
  if (otpAttempts && otpAttempts.length >= 3) {
    reasons.push('Multiple OTP attempts');
    score += 25;
  }
  
  // Check 3: Rapid submission (less than 30 seconds to complete)
  // This would be checked in the API route with timestamp tracking
  
  // Check 4: VPN/Proxy detection (basic check)
  if (await isVpnOrProxy(params.ipAddress)) {
    reasons.push('VPN/Proxy detected');
    score += 20;
  }
  
  // Check 5: Suspicious phone number pattern
  if (params.phoneE164 && isSuspiciousPhonePattern(params.phoneE164)) {
    reasons.push('Suspicious phone pattern');
    score += 15;
  }
  
  // Determine severity
  let severity: FraudSeverity = 'low';
  if (score >= 50) {
    severity = 'high';
  } else if (score >= 30) {
    severity = 'medium';
  }
  
  const isSuspicious = score >= 30;
  
  return {
    isSuspicious,
    severity,
    reasons,
    score,
  };
}

/**
 * Log fraud activity
 */
export async function logFraudActivity(params: {
  eventType: string;
  severity: FraudSeverity;
  ipAddress?: string;
  phoneE164?: string;
  deviceFingerprint?: string;
  details?: any;
}): Promise<void> {
  const supabase = getAdminClient();
  
  // @ts-ignore - private schema access via admin client
  await supabase.schema('private').from('fraud_logs').insert({
    event_type: params.eventType,
    severity: params.severity,
    ip_address: params.ipAddress || null,
    phone_e164: params.phoneE164 || null,
    device_fingerprint: params.deviceFingerprint || null,
    details: params.details || null,
  });
}

/**
 * Basic VPN/Proxy detection
 * In production, use a service like IPQualityScore or IPHub
 */
async function isVpnOrProxy(ipAddress: string): Promise<boolean> {
  // Known VPN/proxy IP ranges (simplified)
  const suspiciousRanges = [
    '10.', // Private network
    '172.16.', // Private network
    '192.168.', // Private network
  ];
  
  return suspiciousRanges.some(range => ipAddress.startsWith(range));
}

/**
 * Check for suspicious phone patterns
 */
function isSuspiciousPhonePattern(phoneE164: string): boolean {
  // Sequential numbers
  if (/(\d)\1{5,}/.test(phoneE164)) {
    return true;
  }
  
  // Known test numbers
  const testPatterns = [
    '+15005550006', // Twilio test number
    '+15551234567', // Common test
  ];
  
  return testPatterns.includes(phoneE164);
}

/**
 * Get fraud statistics (for admin dashboard)
 */
export async function getFraudStatistics(
  hoursBack: number = 24
): Promise<{
  total: number;
  bySeverity: Record<FraudSeverity, number>;
  recentEvents: any[];
}> {
  const supabase = getAdminClient();
  
  const since = new Date(Date.now() - hoursBack * 3600000).toISOString();
  
  // @ts-ignore - private schema access via admin client
  const { data: logs } = await supabase.schema('private')
    .from('fraud_logs')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: false });
  
  const bySeverity: Record<FraudSeverity, number> = {
    low: 0,
    medium: 0,
    high: 0,
  };
  
  logs?.forEach((log: any) => {
    bySeverity[log.severity as FraudSeverity]++;
  });
  
  return {
    total: logs?.length || 0,
    bySeverity,
    recentEvents: logs?.slice(0, 10) || [],
  };
}
