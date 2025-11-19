// Библиотека для работы с Econt API
import { EcontOffice, EcontCity } from '@/types/checkout';

const ECONT_API_BASE_URL = process.env.ECONT_API_URL;
const ECONT_USERNAME = process.env.ECONT_USERNAME;
const ECONT_PASSWORD = process.env.ECONT_PASSWORD;

// Базовая функция для запросов к Econt API
async function econtRequest(endpoint: string, data?: any) {
  if (!ECONT_API_BASE_URL || !ECONT_USERNAME || !ECONT_PASSWORD) {
    throw new Error('Econt API credentials are not configured. Please set ECONT_API_URL, ECONT_USERNAME, and ECONT_PASSWORD in environment variables.');
  }

  const credentials = Buffer.from(`${ECONT_USERNAME}:${ECONT_PASSWORD}`).toString('base64');

  const response = await fetch(`${ECONT_API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Econt API error: ${response.statusText}`);
  }

  return response.json();
}

// Получить список всех городов Болгарии
export async function getEcontCities(): Promise<EcontCity[]> {
  try {
    const response = await econtRequest('/Nomenclatures/NomenclaturesService.getCities.json', {
      countryCode: 'BGR', // Код Болгарии
    });

    if (!response.cities) {
      return [];
    }

    return response.cities.map((city: any) => ({
      id: city.id,
      name: city.name,
      nameEn: city.nameEn,
      postCode: city.postCode,
      countryCode: city.countryCode,
    }));
  } catch (error) {
    console.error('Error fetching Econt cities:', error);
    throw error;
  }
}

// Получить список офисов Econt
export async function getEcontOffices(cityId?: number): Promise<EcontOffice[]> {
  try {
    const response = await econtRequest('/Nomenclatures/NomenclaturesService.getOffices.json', {
      countryCode: 'BGR',
      cityId: cityId,
    });

    if (!response.offices) {
      return [];
    }

    return response.offices.map((office: any) => ({
      id: office.id,
      code: office.code,
      name: office.name,
      nameEn: office.nameEn,
      address: {
        city: {
          id: office.address.city.id,
          name: office.address.city.name,
          nameEn: office.address.city.nameEn,
          postCode: office.address.city.postCode,
        },
        fullAddress: office.address.fullAddress,
        fullAddressEn: office.address.fullAddressEn,
      },
      isOffice: office.type === 'office',
      isAPS: office.type === 'APT', // Automated Parcel Terminal
    }));
  } catch (error) {
    console.error('Error fetching Econt offices:', error);
    throw error;
  }
}

// Получить список автоматов (APT) Econt
export async function getEcontAPT(cityId?: number): Promise<EcontOffice[]> {
  try {
    const offices = await getEcontOffices(cityId);
    return offices.filter(office => office.isAPS);
  } catch (error) {
    console.error('Error fetching Econt APT:', error);
    throw error;
  }
}

// Получить все офисы и автоматы (объединенный список)
export async function getEcontAllPoints(cityId?: number): Promise<EcontOffice[]> {
  try {
    return await getEcontOffices(cityId);
  } catch (error) {
    console.error('Error fetching Econt points:', error);
    throw error;
  }
}
