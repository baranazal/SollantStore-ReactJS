import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import palestineCities from '@/data/palestineCities.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import Auth from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    country: 'Palestine',
    countryCode: 'PS',
    city: '',
    village: '',
    streetAddress: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get countries list with flags
  const countries = useMemo(() => {
    return Country.getAllCountries().map(country => ({
      label: (
        <div className="flex items-center">
          <img
            src={`https://flagcdn.com/24x18/${country.isoCode.toLowerCase()}.png`}
            alt={country.name}
            className="mr-2 h-4 w-6"
          />
          {country.isoCode === 'PS' ? 'Palestine' : country.name}
        </div>
      ),
      value: country.isoCode,
      searchLabel: country.isoCode === 'PS' ? 'Palestine' : country.name, // For search functionality
    }));
  }, []);

  // Set default country (Palestine)
  useEffect(() => {
    const defaultCountry = countries.find(country => country.value === 'PS');
    if (defaultCountry) {
      handleCountryChange(defaultCountry);
    }
  }, [countries]);

  // Updated styles for react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: 'var(--background)',
      borderColor: 'var(--border)',
      '&:hover': {
        borderColor: 'var(--border)'
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'white',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
      color: '#000000',
      '&:hover': {
        backgroundColor: '#f3f4f6'
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--foreground)'
    }),
    input: (base) => ({
      ...base,
      color: 'var(--foreground)'
    })
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordMatch(value === formData.confirmPassword);
      } else {
        setPasswordMatch(value === formData.password);
      }
    }
  };

  const handleCountryChange = (option) => {
    setFormData(prev => ({
      ...prev,
      country: option.searchLabel,
      countryCode: option.value,
      city: '',
      village: ''
    }));

    if (option.value === 'PS') {
      // Use Palestine cities from our JSON
      const formattedCities = palestineCities.cities.map(city => ({
        label: city.name,
        value: city.name
      }));
      setCities(formattedCities);
    } else {
      // Use cities from country-state-city for other countries
      const citiesList = City.getCitiesOfCountry(option.value) || [];
      const formattedCities = citiesList.map(city => ({
        label: city.name,
        value: city.name
      }));
      setCities(formattedCities);
    }
    setVillages([]); // Reset villages when country changes
  };

  const handleCityChange = (option) => {
    setFormData(prev => ({
      ...prev,
      city: option.label,
      village: ''
    }));

    if (formData.countryCode === 'PS') {
      // Get villages for selected Palestine city
      const cityData = palestineCities.cities.find(city => city.name === option.label);
      if (cityData) {
        const formattedVillages = cityData.villages.map(village => ({
          label: village,
          value: village
        }));
        setVillages(formattedVillages);
      }
    }
  };

  const handleVillageChange = (option) => {
    setFormData(prev => ({
      ...prev,
      village: option.label
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    if (!formData.country || !formData.city || !formData.streetAddress.trim()) {
      setError('All address fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptedTerms) {
      setError('You must accept the Terms and Services to continue');
      return;
    }

    try {
      await Auth.signUp(formData);
      
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {/* First Name and Last Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location Fields */}
            <div className="space-y-4">
              {/* Country Field */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  id="country"
                  name="country"
                  options={countries}
                  value={countries.find(country => country.value === formData.countryCode)}
                  onChange={handleCountryChange}
                  styles={selectStyles}
                  placeholder="Select Country"
                  required
                />
              </div>

              {/* City Field */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  id="city"
                  name="city"
                  options={cities}
                  value={cities.find(city => city.label === formData.city)}
                  onChange={handleCityChange}
                  styles={selectStyles}
                  placeholder="Select City"
                  isDisabled={!formData.country}
                  required
                />
              </div>

              {/* Village Field - Only shown for Palestine */}
              {formData.countryCode === 'PS' && (
                <div className="space-y-2">
                  <Label htmlFor="village">Village</Label>
                  <Select
                    id="village"
                    name="village"
                    options={villages}
                    value={villages.find(village => village.label === formData.village)}
                    onChange={handleVillageChange}
                    styles={selectStyles}
                    placeholder="Select Village"
                    isDisabled={!formData.city}
                    required
                  />
                </div>
              )}

              {/* Street Address Field */}
              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  type="text"
                  placeholder="Street Address"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={!passwordMatch && formData.confirmPassword ? 'border-red-500' : ''}
              />
              {!passwordMatch && formData.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I accept the{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms and Services
                </Link>
              </Label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={!passwordMatch}
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;