/**
 * Main Voting Form Component
 * Handles user details and vote submission
 */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { voteSubmissionSchema, type VoteSubmissionInput } from '@/lib/validations/vote';
import { useCountries } from '@/hooks/use-countries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lock, Mail } from 'lucide-react';

interface VotingFormProps {
  candidateId: number;
  candidateName: string;
  onSubmit: (data: VoteSubmissionInput) => Promise<void>;
  loading: boolean;
}

export function VotingForm({
  candidateId,
  candidateName,
  onSubmit,
  loading,
}: VotingFormProps) {
  const { countries } = useCountries();
  
  type FormData = Omit<VoteSubmissionInput, 'language'> & { language?: 'ht' | 'fr' | 'en' | 'es'; email?: string };
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(voteSubmissionSchema) as any,
    defaultValues: {
      candidateId,
      country: 'Haiti',
      language: 'ht',
    },
  });

  const selectedCountry = watch('country');

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      language: data.language || 'ht',
      verificationMethod: 'email',
    } as VoteSubmissionInput & { verificationMethod: 'email' });
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
        <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Ranpli Enfòmasyon Ou
        </CardTitle>
        <CardDescription className="text-base">
          Ou ap vote pou: <span className="font-bold text-foreground">{candidateName}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-base font-semibold">
                Prenon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Prenon"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                disabled={loading}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-base font-semibold">
                Siyati <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Siyati"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                disabled={loading}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-base font-semibold">
              Dat Nesans <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              {...register('dob')}
              error={!!errors.dob}
              helperText={errors.dob?.message}
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
              className="h-12 text-base"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Adrès Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="example@gmail.com"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={loading}
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Nou pral voye yon kòd verifikasyon sou email sa a
              </p>
            </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-base font-semibold">
              Peyi <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedCountry}
              onValueChange={(value) => setValue('country', value)}
              disabled={loading}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Chwazi peyi ou" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-xs text-destructive">{errors.country.message}</p>
            )}
          </div>

          {/* Region/City (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="region" className="text-base font-semibold">Rejyon/Vil (Opsyonèl)</Label>
            <Input
              id="region"
              {...register('region')}
              placeholder="Port-au-Prince, Miami, Montréal, etc."
              disabled={loading}
              className="h-12 text-base"
            />
          </div>

          {/* Privacy Notice */}
          <Alert className="border-2 border-blue-200 bg-blue-50">
            <Lock className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-sm font-medium text-gray-900">
              <strong>Enfòmasyon prive:</strong> Nou kolekte non, dat nesans, ak email ou sèlman pou evite vòt doub. 
              Enfòmasyon sa yo pa pral pibliye. Yon kòd verifikasyon pral voye sou email ou.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full h-14 text-lg font-bold shadow-lg"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Ap voye kòd...' : 'Voye Kòd Email'}
          </Button>

          {/* Info */}
          <Alert className="border-2 border-purple-200 bg-purple-50">
            <Info className="h-5 w-5 text-purple-600" />
            <AlertDescription className="text-sm font-medium text-gray-900">
              Apre ou ranpli fòm sa, n ap voye yon kòd 6 chif sou email ou pou verifye.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  );
}
