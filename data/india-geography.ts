// Comprehensive India Geography Data
// All 28 States + 8 Union Territories with Districts

export interface TalukaData {
    name: string;
    pincode?: string;
}

export interface DistrictData {
    name: string;
    talukas?: TalukaData[];
}

export interface StateData {
    name: string;
    code: string;
    type: 'state' | 'ut';
    districts: DistrictData[];
}

// Major Agricultural States with Talukas
export const INDIA_GEOGRAPHY: StateData[] = [
    // PUNJAB - Major Agricultural State
    {
        name: 'Punjab',
        code: 'PB',
        type: 'state',
        districts: [
            { name: 'Amritsar', talukas: [{ name: 'Amritsar-I' }, { name: 'Amritsar-II' }, { name: 'Ajnala' }, { name: 'Baba Bakala' }] },
            { name: 'Barnala', talukas: [{ name: 'Barnala' }, { name: 'Tapa' }] },
            { name: 'Bathinda', talukas: [{ name: 'Bathinda' }, { name: 'Rampura Phul' }, { name: 'Talwandi Sabo' }] },
            { name: 'Faridkot', talukas: [{ name: 'Faridkot' }, { name: 'Kotkapura' }] },
            { name: 'Fatehgarh Sahib', talukas: [{ name: 'Fatehgarh Sahib' }, { name: 'Amloh' }, { name: 'Bassi Pathana' }] },
            { name: 'Fazilka', talukas: [{ name: 'Fazilka' }, { name: 'Abohar' }, { name: 'Jalalabad' }] },
            { name: 'Ferozepur', talukas: [{ name: 'Ferozepur' }, { name: 'Zira' }, { name: 'Guru Har Sahai' }] },
            { name: 'Gurdaspur', talukas: [{ name: 'Gurdaspur' }, { name: 'Batala' }, { name: 'Dera Baba Nanak' }] },
            { name: 'Hoshiarpur', talukas: [{ name: 'Hoshiarpur' }, { name: 'Garhshankar' }, { name: 'Dasuya' }, { name: 'Mukerian' }] },
            { name: 'Jalandhar', talukas: [{ name: 'Jalandhar-I' }, { name: 'Jalandhar-II' }, { name: 'Phillaur' }, { name: 'Nakodar' }, { name: 'Shahkot' }] },
            { name: 'Kapurthala', talukas: [{ name: 'Kapurthala' }, { name: 'Phagwara' }, { name: 'Sultanpur Lodhi' }] },
            { name: 'Ludhiana', talukas: [{ name: 'Ludhiana-I' }, { name: 'Ludhiana-II' }, { name: 'Khanna' }, { name: 'Samrala' }, { name: 'Jagraon' }, { name: 'Raikot' }] },
            { name: 'Mansa', talukas: [{ name: 'Mansa' }, { name: 'Budhlada' }, { name: 'Sardulgarh' }] },
            { name: 'Moga', talukas: [{ name: 'Moga' }, { name: 'Baghapurana' }, { name: 'Nihal Singh Wala' }] },
            { name: 'Muktsar', talukas: [{ name: 'Muktsar' }, { name: 'Malout' }, { name: 'Gidderbaha' }] },
            { name: 'Pathankot', talukas: [{ name: 'Pathankot' }, { name: 'Sujanpur' }] },
            { name: 'Patiala', talukas: [{ name: 'Patiala' }, { name: 'Rajpura' }, { name: 'Nabha' }, { name: 'Samana' }, { name: 'Patran' }] },
            { name: 'Rupnagar', talukas: [{ name: 'Rupnagar' }, { name: 'Anandpur Sahib' }, { name: 'Chamkaur Sahib' }] },
            { name: 'Sangrur', talukas: [{ name: 'Sangrur' }, { name: 'Malerkotla' }, { name: 'Dhuri' }, { name: 'Sunam' }, { name: 'Moonak' }] },
            { name: 'SAS Nagar (Mohali)', talukas: [{ name: 'Mohali' }, { name: 'Kharar' }, { name: 'Dera Bassi' }] },
            { name: 'SBS Nagar (Nawanshahr)', talukas: [{ name: 'Nawanshahr' }, { name: 'Banga' }, { name: 'Balachaur' }] },
            { name: 'Tarn Taran', talukas: [{ name: 'Tarn Taran' }, { name: 'Patti' }, { name: 'Khadoor Sahib' }] },
        ]
    },

    // HARYANA - Major Agricultural State
    {
        name: 'Haryana',
        code: 'HR',
        type: 'state',
        districts: [
            { name: 'Ambala', talukas: [{ name: 'Ambala' }, { name: 'Barara' }, { name: 'Naraingarh' }] },
            { name: 'Bhiwani', talukas: [{ name: 'Bhiwani' }, { name: 'Charkhi Dadri' }, { name: 'Siwani' }, { name: 'Tosham' }] },
            { name: 'Faridabad', talukas: [{ name: 'Faridabad' }, { name: 'Ballabgarh' }] },
            { name: 'Fatehabad', talukas: [{ name: 'Fatehabad' }, { name: 'Ratia' }, { name: 'Tohana' }] },
            { name: 'Gurugram', talukas: [{ name: 'Gurugram' }, { name: 'Pataudi' }, { name: 'Sohna' }] },
            { name: 'Hisar', talukas: [{ name: 'Hisar-I' }, { name: 'Hisar-II' }, { name: 'Hansi-I' }, { name: 'Hansi-II' }, { name: 'Barwala' }] },
            { name: 'Jhajjar', talukas: [{ name: 'Jhajjar' }, { name: 'Bahadurgarh' }, { name: 'Beri' }] },
            { name: 'Jind', talukas: [{ name: 'Jind' }, { name: 'Safidon' }, { name: 'Narwana' }, { name: 'Julana' }] },
            { name: 'Kaithal', talukas: [{ name: 'Kaithal' }, { name: 'Kalayat' }, { name: 'Guhla' }, { name: 'Pundri' }] },
            { name: 'Karnal', talukas: [{ name: 'Karnal' }, { name: 'Nilokheri' }, { name: 'Indri' }, { name: 'Gharaunda' }, { name: 'Assandh' }] },
            { name: 'Kurukshetra', talukas: [{ name: 'Kurukshetra' }, { name: 'Thanesar' }, { name: 'Pehowa' }, { name: 'Shahabad' }] },
            { name: 'Mahendragarh', talukas: [{ name: 'Mahendragarh' }, { name: 'Narnaul' }, { name: 'Ateli' }] },
            { name: 'Nuh (Mewat)', talukas: [{ name: 'Nuh' }, { name: 'Ferozepur Jhirka' }, { name: 'Taoru' }, { name: 'Punhana' }] },
            { name: 'Palwal', talukas: [{ name: 'Palwal' }, { name: 'Hodal' }, { name: 'Hathin' }] },
            { name: 'Panchkula', talukas: [{ name: 'Panchkula' }, { name: 'Kalka' }, { name: 'Raipur Rani' }] },
            { name: 'Panipat', talukas: [{ name: 'Panipat' }, { name: 'Samalkha' }, { name: 'Israna' }] },
            { name: 'Rewari', talukas: [{ name: 'Rewari' }, { name: 'Bawal' }, { name: 'Kosli' }] },
            { name: 'Rohtak', talukas: [{ name: 'Rohtak' }, { name: 'Kalanaur' }, { name: 'Meham' }, { name: 'Lakhan Majra' }] },
            { name: 'Sirsa', talukas: [{ name: 'Sirsa' }, { name: 'Dabwali' }, { name: 'Rania' }, { name: 'Ellenabad' }] },
            { name: 'Sonipat', talukas: [{ name: 'Sonipat' }, { name: 'Ganaur' }, { name: 'Gohana' }, { name: 'Kharkhoda' }] },
            { name: 'Yamunanagar', talukas: [{ name: 'Yamunanagar' }, { name: 'Jagadhri' }, { name: 'Radaur' }, { name: 'Bilaspur' }] },
            { name: 'Charkhi Dadri', talukas: [{ name: 'Charkhi Dadri' }, { name: 'Badhra' }] },
        ]
    },

    // UTTAR PRADESH - Largest Agricultural State
    {
        name: 'Uttar Pradesh',
        code: 'UP',
        type: 'state',
        districts: [
            { name: 'Agra', talukas: [{ name: 'Agra' }, { name: 'Fatehabad' }, { name: 'Kheragarh' }, { name: 'Bah' }] },
            { name: 'Aligarh', talukas: [{ name: 'Aligarh' }, { name: 'Khair' }, { name: 'Atrauli' }, { name: 'Iglas' }] },
            { name: 'Allahabad (Prayagraj)', talukas: [{ name: 'Allahabad' }, { name: 'Handia' }, { name: 'Soraon' }, { name: 'Phulpur' }] },
            { name: 'Ambedkar Nagar' },
            { name: 'Amethi' },
            { name: 'Amroha' },
            { name: 'Auraiya' },
            { name: 'Azamgarh' },
            { name: 'Baghpat', talukas: [{ name: 'Baghpat' }, { name: 'Baraut' }, { name: 'Khekra' }] },
            { name: 'Bahraich' },
            { name: 'Ballia' },
            { name: 'Balrampur' },
            { name: 'Banda' },
            { name: 'Barabanki' },
            { name: 'Bareilly', talukas: [{ name: 'Bareilly' }, { name: 'Faridpur' }, { name: 'Aonla' }, { name: 'Nawabganj' }] },
            { name: 'Basti' },
            { name: 'Bhadohi' },
            { name: 'Bijnor' },
            { name: 'Budaun' },
            { name: 'Bulandshahr', talukas: [{ name: 'Bulandshahr' }, { name: 'Sikandrabad' }, { name: 'Khurja' }, { name: 'Anoopshahr' }] },
            { name: 'Chandauli' },
            { name: 'Chitrakoot' },
            { name: 'Deoria' },
            { name: 'Etah' },
            { name: 'Etawah' },
            { name: 'Faizabad (Ayodhya)' },
            { name: 'Farrukhabad' },
            { name: 'Fatehpur' },
            { name: 'Firozabad' },
            { name: 'Gautam Buddha Nagar', talukas: [{ name: 'Noida' }, { name: 'Dadri' }, { name: 'Jewar' }] },
            { name: 'Ghaziabad', talukas: [{ name: 'Ghaziabad' }, { name: 'Modinagar' }, { name: 'Hapur' }, { name: 'Muradnagar' }] },
            { name: 'Ghazipur' },
            { name: 'Gonda' },
            { name: 'Gorakhpur' },
            { name: 'Hamirpur' },
            { name: 'Hapur' },
            { name: 'Hardoi' },
            { name: 'Hathras' },
            { name: 'Jalaun' },
            { name: 'Jaunpur' },
            { name: 'Jhansi' },
            { name: 'Kannauj' },
            { name: 'Kanpur Dehat' },
            { name: 'Kanpur Nagar' },
            { name: 'Kasganj' },
            { name: 'Kaushambi' },
            { name: 'Kushinagar' },
            { name: 'Lakhimpur Kheri' },
            { name: 'Lalitpur' },
            { name: 'Lucknow', talukas: [{ name: 'Lucknow' }, { name: 'Mohanlalganj' }, { name: 'Malihabad' }, { name: 'Bakshi Ka Talab' }] },
            { name: 'Maharajganj' },
            { name: 'Mahoba' },
            { name: 'Mainpuri' },
            { name: 'Mathura', talukas: [{ name: 'Mathura' }, { name: 'Chhata' }, { name: 'Mant' }, { name: 'Govardhan' }] },
            { name: 'Mau' },
            { name: 'Meerut', talukas: [{ name: 'Meerut' }, { name: 'Sardhana' }, { name: 'Mawana' }, { name: 'Parikshitgarh' }] },
            { name: 'Mirzapur' },
            { name: 'Moradabad' },
            { name: 'Muzaffarnagar', talukas: [{ name: 'Muzaffarnagar' }, { name: 'Shamli' }, { name: 'Kairana' }, { name: 'Budhana' }] },
            { name: 'Pilibhit' },
            { name: 'Pratapgarh' },
            { name: 'Rae Bareli' },
            { name: 'Rampur' },
            { name: 'Saharanpur', talukas: [{ name: 'Saharanpur' }, { name: 'Deoband' }, { name: 'Nakur' }, { name: 'Behat' }] },
            { name: 'Sambhal' },
            { name: 'Sant Kabir Nagar' },
            { name: 'Shahjahanpur' },
            { name: 'Shamli' },
            { name: 'Shravasti' },
            { name: 'Siddharthnagar' },
            { name: 'Sitapur' },
            { name: 'Sonbhadra' },
            { name: 'Sultanpur' },
            { name: 'Unnao' },
            { name: 'Varanasi' },
        ]
    },

    // MADHYA PRADESH
    {
        name: 'Madhya Pradesh',
        code: 'MP',
        type: 'state',
        districts: [
            { name: 'Agar Malwa' }, { name: 'Alirajpur' }, { name: 'Anuppur' },
            { name: 'Ashoknagar' }, { name: 'Balaghat' }, { name: 'Barwani' },
            { name: 'Betul' }, { name: 'Bhind' }, { name: 'Bhopal', talukas: [{ name: 'Bhopal' }, { name: 'Huzur' }, { name: 'Berasia' }] },
            { name: 'Burhanpur' }, { name: 'Chhatarpur' }, { name: 'Chhindwara' },
            { name: 'Damoh' }, { name: 'Datia' }, { name: 'Dewas' },
            { name: 'Dhar' }, { name: 'Dindori' }, { name: 'Guna' },
            { name: 'Gwalior', talukas: [{ name: 'Gwalior' }, { name: 'Dabra' }, { name: 'Bhitarwar' }] },
            { name: 'Harda' }, { name: 'Hoshangabad' }, { name: 'Indore', talukas: [{ name: 'Indore' }, { name: 'Depalpur' }, { name: 'Mhow' }, { name: 'Sanwer' }] },
            { name: 'Jabalpur', talukas: [{ name: 'Jabalpur' }, { name: 'Sihora' }, { name: 'Patan' }] },
            { name: 'Jhabua' }, { name: 'Katni' }, { name: 'Khandwa' },
            { name: 'Khargone' }, { name: 'Mandla' }, { name: 'Mandsaur' },
            { name: 'Morena' }, { name: 'Narsinghpur' }, { name: 'Neemuch' },
            { name: 'Niwari' }, { name: 'Panna' }, { name: 'Raisen' },
            { name: 'Rajgarh' }, { name: 'Ratlam' }, { name: 'Rewa' },
            { name: 'Sagar' }, { name: 'Satna' }, { name: 'Sehore' },
            { name: 'Seoni' }, { name: 'Shahdol' }, { name: 'Shajapur' },
            { name: 'Sheopur' }, { name: 'Shivpuri' }, { name: 'Sidhi' },
            { name: 'Singrauli' }, { name: 'Tikamgarh' }, { name: 'Ujjain', talukas: [{ name: 'Ujjain' }, { name: 'Nagda' }, { name: 'Tarana' }] },
            { name: 'Umaria' }, { name: 'Vidisha' },
        ]
    },

    // RAJASTHAN
    {
        name: 'Rajasthan',
        code: 'RJ',
        type: 'state',
        districts: [
            { name: 'Ajmer' }, { name: 'Alwar' }, { name: 'Banswara' },
            { name: 'Baran' }, { name: 'Barmer' }, { name: 'Bharatpur' },
            { name: 'Bhilwara' }, { name: 'Bikaner' }, { name: 'Bundi' },
            { name: 'Chittorgarh' }, { name: 'Churu' }, { name: 'Dausa' },
            { name: 'Dholpur' }, { name: 'Dungarpur' }, { name: 'Hanumangarh', talukas: [{ name: 'Hanumangarh' }, { name: 'Bhadra' }, { name: 'Nohar' }] },
            { name: 'Jaipur', talukas: [{ name: 'Jaipur' }, { name: 'Amber' }, { name: 'Sanganer' }, { name: 'Chaksu' }] },
            { name: 'Jaisalmer' }, { name: 'Jalore' }, { name: 'Jhalawar' },
            { name: 'Jhunjhunu' }, { name: 'Jodhpur', talukas: [{ name: 'Jodhpur' }, { name: 'Bilara' }, { name: 'Osian' }] },
            { name: 'Karauli' }, { name: 'Kota' }, { name: 'Nagaur' },
            { name: 'Pali' }, { name: 'Pratapgarh' }, { name: 'Rajsamand' },
            { name: 'Sawai Madhopur' }, { name: 'Sikar' }, { name: 'Sirohi' },
            { name: 'Sri Ganganagar', talukas: [{ name: 'Sri Ganganagar' }, { name: 'Suratgarh' }, { name: 'Raisinghnagar' }] },
            { name: 'Tonk' }, { name: 'Udaipur' },
        ]
    },

    // GUJARAT
    {
        name: 'Gujarat',
        code: 'GJ',
        type: 'state',
        districts: [
            { name: 'Ahmedabad', talukas: [{ name: 'Ahmedabad' }, { name: 'Daskroi' }, { name: 'Sanand' }, { name: 'Dholka' }] },
            { name: 'Amreli' }, { name: 'Anand', talukas: [{ name: 'Anand' }, { name: 'Khambhat' }, { name: 'Borsad' }, { name: 'Petlad' }] },
            { name: 'Aravalli' }, { name: 'Banaskantha', talukas: [{ name: 'Palanpur' }, { name: 'Deesa' }, { name: 'Dhanera' }] },
            { name: 'Bharuch' }, { name: 'Bhavnagar' }, { name: 'Botad' },
            { name: 'Chhota Udaipur' }, { name: 'Dahod' }, { name: 'Dang' },
            { name: 'Devbhoomi Dwarka' }, { name: 'Gandhinagar', talukas: [{ name: 'Gandhinagar' }, { name: 'Kalol' }, { name: 'Mansa' }, { name: 'Dehgam' }] },
            { name: 'Gir Somnath' }, { name: 'Jamnagar' }, { name: 'Junagadh' },
            { name: 'Kheda' }, { name: 'Kutch' }, { name: 'Mahisagar' },
            { name: 'Mehsana', talukas: [{ name: 'Mehsana' }, { name: 'Visnagar' }, { name: 'Unjha' }, { name: 'Kadi' }] },
            { name: 'Morbi' }, { name: 'Narmada' }, { name: 'Navsari' },
            { name: 'Panchmahal' }, { name: 'Patan' }, { name: 'Porbandar' },
            { name: 'Rajkot', talukas: [{ name: 'Rajkot' }, { name: 'Gondal' }, { name: 'Jasdan' }, { name: 'Jetpur' }] },
            { name: 'Sabarkantha' }, { name: 'Surat', talukas: [{ name: 'Surat' }, { name: 'Kamrej' }, { name: 'Bardoli' }, { name: 'Olpad' }] },
            { name: 'Surendranagar' }, { name: 'Tapi' }, { name: 'Vadodara', talukas: [{ name: 'Vadodara' }, { name: 'Padra' }, { name: 'Dabhoi' }, { name: 'Karjan' }] },
            { name: 'Valsad' },
        ]
    },

    // MAHARASHTRA
    {
        name: 'Maharashtra',
        code: 'MH',
        type: 'state',
        districts: [
            { name: 'Ahmednagar' }, { name: 'Akola' }, { name: 'Amravati' },
            { name: 'Aurangabad' }, { name: 'Beed' }, { name: 'Bhandara' },
            { name: 'Buldhana' }, { name: 'Chandrapur' }, { name: 'Dhule' },
            { name: 'Gadchiroli' }, { name: 'Gondia' }, { name: 'Hingoli' },
            { name: 'Jalgaon' }, { name: 'Jalna' }, { name: 'Kolhapur' },
            { name: 'Latur' }, { name: 'Mumbai City' }, { name: 'Mumbai Suburban' },
            { name: 'Nagpur', talukas: [{ name: 'Nagpur (Urban)' }, { name: 'Nagpur (Rural)' }, { name: 'Hingna' }, { name: 'Kamptee' }] },
            { name: 'Nanded' }, { name: 'Nandurbar' }, { name: 'Nashik', talukas: [{ name: 'Nashik' }, { name: 'Igatpuri' }, { name: 'Sinnar' }, { name: 'Niphad' }] },
            { name: 'Osmanabad' }, { name: 'Palghar' }, { name: 'Parbhani' },
            { name: 'Pune', talukas: [{ name: 'Pune City' }, { name: 'Haveli' }, { name: 'Baramati' }, { name: 'Shirur' }, { name: 'Junnar' }] },
            { name: 'Raigad' }, { name: 'Ratnagiri' }, { name: 'Sangli' },
            { name: 'Satara' }, { name: 'Sindhudurg' }, { name: 'Solapur' },
            { name: 'Thane' }, { name: 'Wardha' }, { name: 'Washim' },
            { name: 'Yavatmal' },
        ]
    },

    // KARNATAKA
    {
        name: 'Karnataka',
        code: 'KA',
        type: 'state',
        districts: [
            { name: 'Bagalkot' }, { name: 'Ballari (Bellary)' }, { name: 'Belagavi (Belgaum)' },
            { name: 'Bengaluru Rural' }, { name: 'Bengaluru Urban' }, { name: 'Bidar' },
            { name: 'Chamarajanagar' }, { name: 'Chikballapur' }, { name: 'Chikkamagaluru' },
            { name: 'Chitradurga' }, { name: 'Dakshina Kannada' }, { name: 'Davanagere' },
            { name: 'Dharwad' }, { name: 'Gadag' }, { name: 'Hassan' },
            { name: 'Haveri' }, { name: 'Kalaburagi (Gulbarga)' }, { name: 'Kodagu' },
            { name: 'Kolar' }, { name: 'Koppal' }, { name: 'Mandya' },
            { name: 'Mysuru (Mysore)' }, { name: 'Raichur' }, { name: 'Ramanagara' },
            { name: 'Shivamogga (Shimoga)' }, { name: 'Tumakuru (Tumkur)' }, { name: 'Udupi' },
            { name: 'Uttara Kannada' }, { name: 'Vijayapura (Bijapur)' }, { name: 'Yadgir' },
        ]
    },

    // ANDHRA PRADESH
    {
        name: 'Andhra Pradesh',
        code: 'AP',
        type: 'state',
        districts: [
            { name: 'Anantapur' }, { name: 'Chittoor' }, { name: 'East Godavari' },
            { name: 'Guntur' }, { name: 'Krishna' }, { name: 'Kurnool' },
            { name: 'Nellore' }, { name: 'Prakasam' }, { name: 'Srikakulam' },
            { name: 'Visakhapatnam' }, { name: 'Vizianagaram' }, { name: 'West Godavari' },
            { name: 'YSR Kadapa' },
        ]
    },

    // TELANGANA
    {
        name: 'Telangana',
        code: 'TG',
        type: 'state',
        districts: [
            { name: 'Adilabad' }, { name: 'Bhadradri Kothagudem' }, { name: 'Hyderabad' },
            { name: 'Jagtial' }, { name: 'Jangaon' }, { name: 'Jayashankar Bhupalpally' },
            { name: 'Jogulamba Gadwal' }, { name: 'Kamareddy' }, { name: 'Karimnagar' },
            { name: 'Khammam' }, { name: 'Kumuram Bheem' }, { name: 'Mahabubabad' },
            { name: 'Mahabubnagar' }, { name: 'Mancherial' }, { name: 'Medak' },
            { name: 'Medchal-Malkajgiri' }, { name: 'Mulugu' }, { name: 'Nagarkurnool' },
            { name: 'Nalgonda' }, { name: 'Narayanpet' }, { name: 'Nirmal' },
            { name: 'Nizamabad' }, { name: 'Peddapalli' }, { name: 'Rajanna Sircilla' },
            { name: 'Rangareddy' }, { name: 'Sangareddy' }, { name: 'Siddipet' },
            { name: 'Suryapet' }, { name: 'Vikarabad' }, { name: 'Wanaparthy' },
            { name: 'Warangal Rural' }, { name: 'Warangal Urban' }, { name: 'Yadadri Bhuvanagiri' },
        ]
    },

    // TAMIL NADU
    {
        name: 'Tamil Nadu',
        code: 'TN',
        type: 'state',
        districts: [
            { name: 'Ariyalur' }, { name: 'Chengalpattu' }, { name: 'Chennai' },
            { name: 'Coimbatore' }, { name: 'Cuddalore' }, { name: 'Dharmapuri' },
            { name: 'Dindigul' }, { name: 'Erode' }, { name: 'Kallakurichi' },
            { name: 'Kancheepuram' }, { name: 'Kanyakumari' }, { name: 'Karur' },
            { name: 'Krishnagiri' }, { name: 'Madurai' }, { name: 'Mayiladuthurai' },
            { name: 'Nagapattinam' }, { name: 'Namakkal' }, { name: 'Nilgiris' },
            { name: 'Perambalur' }, { name: 'Pudukkottai' }, { name: 'Ramanathapuram' },
            { name: 'Ranipet' }, { name: 'Salem' }, { name: 'Sivaganga' },
            { name: 'Tenkasi' }, { name: 'Thanjavur' }, { name: 'Theni' },
            { name: 'Thoothukudi' }, { name: 'Tiruchirappalli' }, { name: 'Tirunelveli' },
            { name: 'Tirupathur' }, { name: 'Tiruppur' }, { name: 'Tiruvallur' },
            { name: 'Tiruvannamalai' }, { name: 'Tiruvarur' }, { name: 'Vellore' },
            { name: 'Viluppuram' }, { name: 'Virudhunagar' },
        ]
    },

    // BIHAR
    {
        name: 'Bihar',
        code: 'BR',
        type: 'state',
        districts: [
            { name: 'Araria' }, { name: 'Arwal' }, { name: 'Aurangabad' },
            { name: 'Banka' }, { name: 'Begusarai' }, { name: 'Bhagalpur' },
            { name: 'Bhojpur' }, { name: 'Buxar' }, { name: 'Darbhanga' },
            { name: 'East Champaran' }, { name: 'Gaya' }, { name: 'Gopalganj' },
            { name: 'Jamui' }, { name: 'Jehanabad' }, { name: 'Kaimur' },
            { name: 'Katihar' }, { name: 'Khagaria' }, { name: 'Kishanganj' },
            { name: 'Lakhisarai' }, { name: 'Madhepura' }, { name: 'Madhubani' },
            { name: 'Munger' }, { name: 'Muzaffarpur' }, { name: 'Nalanda' },
            { name: 'Nawada' }, { name: 'Patna' }, { name: 'Purnia' },
            { name: 'Rohtas' }, { name: 'Saharsa' }, { name: 'Samastipur' },
            { name: 'Saran' }, { name: 'Sheikhpura' }, { name: 'Sheohar' },
            { name: 'Sitamarhi' }, { name: 'Siwan' }, { name: 'Supaul' },
            { name: 'Vaishali' }, { name: 'West Champaran' },
        ]
    },

    // WEST BENGAL
    {
        name: 'West Bengal',
        code: 'WB',
        type: 'state',
        districts: [
            { name: 'Alipurduar' }, { name: 'Bankura' }, { name: 'Birbhum' },
            { name: 'Cooch Behar' }, { name: 'Dakshin Dinajpur' }, { name: 'Darjeeling' },
            { name: 'Hooghly' }, { name: 'Howrah' }, { name: 'Jalpaiguri' },
            { name: 'Jhargram' }, { name: 'Kalimpong' }, { name: 'Kolkata' },
            { name: 'Malda' }, { name: 'Murshidabad' }, { name: 'Nadia' },
            { name: 'North 24 Parganas' }, { name: 'Paschim Bardhaman' }, { name: 'Paschim Medinipur' },
            { name: 'Purba Bardhaman' }, { name: 'Purba Medinipur' }, { name: 'Purulia' },
            { name: 'South 24 Parganas' }, { name: 'Uttar Dinajpur' },
        ]
    },

    // ODISHA
    {
        name: 'Odisha',
        code: 'OD',
        type: 'state',
        districts: [
            { name: 'Angul' }, { name: 'Balangir' }, { name: 'Balasore' },
            { name: 'Bargarh' }, { name: 'Bhadrak' }, { name: 'Boudh' },
            { name: 'Cuttack' }, { name: 'Deogarh' }, { name: 'Dhenkanal' },
            { name: 'Gajapati' }, { name: 'Ganjam' }, { name: 'Jagatsinghpur' },
            { name: 'Jajpur' }, { name: 'Jharsuguda' }, { name: 'Kalahandi' },
            { name: 'Kandhamal' }, { name: 'Kendrapara' }, { name: 'Kendujhar' },
            { name: 'Khordha' }, { name: 'Koraput' }, { name: 'Malkangiri' },
            { name: 'Mayurbhanj' }, { name: 'Nabarangpur' }, { name: 'Nayagarh' },
            { name: 'Nuapada' }, { name: 'Puri' }, { name: 'Rayagada' },
            { name: 'Sambalpur' }, { name: 'Subarnapur' }, { name: 'Sundargarh' },
        ]
    },

    // CHHATTISGARH
    {
        name: 'Chhattisgarh',
        code: 'CG',
        type: 'state',
        districts: [
            { name: 'Balod' }, { name: 'Baloda Bazar' }, { name: 'Balrampur' },
            { name: 'Bastar' }, { name: 'Bemetara' }, { name: 'Bijapur' },
            { name: 'Bilaspur' }, { name: 'Dantewada' }, { name: 'Dhamtari' },
            { name: 'Durg' }, { name: 'Gariaband' }, { name: 'Janjgir-Champa' },
            { name: 'Jashpur' }, { name: 'Kabirdham' }, { name: 'Kanker' },
            { name: 'Kondagaon' }, { name: 'Korba' }, { name: 'Koriya' },
            { name: 'Mahasamund' }, { name: 'Mungeli' }, { name: 'Narayanpur' },
            { name: 'Raigarh' }, { name: 'Raipur' }, { name: 'Rajnandgaon' },
            { name: 'Sukma' }, { name: 'Surajpur' }, { name: 'Surguja' },
        ]
    },

    // JHARKHAND
    {
        name: 'Jharkhand',
        code: 'JH',
        type: 'state',
        districts: [
            { name: 'Bokaro' }, { name: 'Chatra' }, { name: 'Deoghar' },
            { name: 'Dhanbad' }, { name: 'Dumka' }, { name: 'East Singhbhum' },
            { name: 'Garhwa' }, { name: 'Giridih' }, { name: 'Godda' },
            { name: 'Gumla' }, { name: 'Hazaribagh' }, { name: 'Jamtara' },
            { name: 'Khunti' }, { name: 'Koderma' }, { name: 'Latehar' },
            { name: 'Lohardaga' }, { name: 'Pakur' }, { name: 'Palamu' },
            { name: 'Ramgarh' }, { name: 'Ranchi' }, { name: 'Sahebganj' },
            { name: 'Seraikela Kharsawan' }, { name: 'Simdega' }, { name: 'West Singhbhum' },
        ]
    },

    // ASSAM
    {
        name: 'Assam',
        code: 'AS',
        type: 'state',
        districts: [
            { name: 'Baksa' }, { name: 'Barpeta' }, { name: 'Biswanath' },
            { name: 'Bongaigaon' }, { name: 'Cachar' }, { name: 'Charaideo' },
            { name: 'Chirang' }, { name: 'Darrang' }, { name: 'Dhemaji' },
            { name: 'Dhubri' }, { name: 'Dibrugarh' }, { name: 'Dima Hasao' },
            { name: 'Goalpara' }, { name: 'Golaghat' }, { name: 'Hailakandi' },
            { name: 'Hojai' }, { name: 'Jorhat' }, { name: 'Kamrup' },
            { name: 'Kamrup Metropolitan' }, { name: 'Karbi Anglong' }, { name: 'Karimganj' },
            { name: 'Kokrajhar' }, { name: 'Lakhimpur' }, { name: 'Majuli' },
            { name: 'Morigaon' }, { name: 'Nagaon' }, { name: 'Nalbari' },
            { name: 'Sivasagar' }, { name: 'Sonitpur' }, { name: 'South Salmara-Mankachar' },
            { name: 'Tinsukia' }, { name: 'Udalguri' }, { name: 'West Karbi Anglong' },
        ]
    },

    // KERALA
    {
        name: 'Kerala',
        code: 'KL',
        type: 'state',
        districts: [
            { name: 'Alappuzha' }, { name: 'Ernakulam' }, { name: 'Idukki' },
            { name: 'Kannur' }, { name: 'Kasaragod' }, { name: 'Kollam' },
            { name: 'Kottayam' }, { name: 'Kozhikode' }, { name: 'Malappuram' },
            { name: 'Palakkad' }, { name: 'Pathanamthitta' }, { name: 'Thiruvananthapuram' },
            { name: 'Thrissur' }, { name: 'Wayanad' },
        ]
    },

    // Other states without detailed talukas
    { name: 'Arunachal Pradesh', code: 'AR', type: 'state', districts: [{ name: 'Tawang' }, { name: 'West Kameng' }, { name: 'East Kameng' }, { name: 'Papum Pare' }, { name: 'Kurung Kumey' }, { name: 'Kra Daadi' }, { name: 'Lower Subansiri' }, { name: 'Upper Subansiri' }, { name: 'West Siang' }, { name: 'East Siang' }, { name: 'Siang' }, { name: 'Upper Siang' }, { name: 'Lower Siang' }, { name: 'Lower Dibang Valley' }, { name: 'Dibang Valley' }, { name: 'Anjaw' }, { name: 'Lohit' }, { name: 'Namsai' }, { name: 'Changlang' }, { name: 'Tirap' }, { name: 'Longding' }] },
    { name: 'Goa', code: 'GA', type: 'state', districts: [{ name: 'North Goa' }, { name: 'South Goa' }] },
    { name: 'Himachal Pradesh', code: 'HP', type: 'state', districts: [{ name: 'Bilaspur' }, { name: 'Chamba' }, { name: 'Hamirpur' }, { name: 'Kangra' }, { name: 'Kinnaur' }, { name: 'Kullu' }, { name: 'Lahaul and Spiti' }, { name: 'Mandi' }, { name: 'Shimla' }, { name: 'Sirmaur' }, { name: 'Solan' }, { name: 'Una' }] },
    { name: 'Manipur', code: 'MN', type: 'state', districts: [{ name: 'Bishnupur' }, { name: 'Chandel' }, { name: 'Churachandpur' }, { name: 'Imphal East' }, { name: 'Imphal West' }, { name: 'Jiribam' }, { name: 'Kakching' }, { name: 'Kamjong' }, { name: 'Kangpokpi' }, { name: 'Noney' }, { name: 'Pherzawl' }, { name: 'Senapati' }, { name: 'Tamenglong' }, { name: 'Tengnoupal' }, { name: 'Thoubal' }, { name: 'Ukhrul' }] },
    { name: 'Meghalaya', code: 'ML', type: 'state', districts: [{ name: 'East Garo Hills' }, { name: 'East Jaintia Hills' }, { name: 'East Khasi Hills' }, { name: 'North Garo Hills' }, { name: 'Ri Bhoi' }, { name: 'South Garo Hills' }, { name: 'South West Garo Hills' }, { name: 'South West Khasi Hills' }, { name: 'West Garo Hills' }, { name: 'West Jaintia Hills' }, { name: 'West Khasi Hills' }] },
    { name: 'Mizoram', code: 'MZ', type: 'state', districts: [{ name: 'Aizawl' }, { name: 'Champhai' }, { name: 'Hnahthial' }, { name: 'Khawzawl' }, { name: 'Kolasib' }, { name: 'Lawngtlai' }, { name: 'Lunglei' }, { name: 'Mamit' }, { name: 'Saiha' }, { name: 'Saitual' }, { name: 'Serchhip' }] },
    { name: 'Nagaland', code: 'NL', type: 'state', districts: [{ name: 'Dimapur' }, { name: 'Kiphire' }, { name: 'Kohima' }, { name: 'Longleng' }, { name: 'Mokokchung' }, { name: 'Mon' }, { name: 'Peren' }, { name: 'Phek' }, { name: 'Tuensang' }, { name: 'Wokha' }, { name: 'Zunheboto' }] },
    { name: 'Sikkim', code: 'SK', type: 'state', districts: [{ name: 'East Sikkim' }, { name: 'North Sikkim' }, { name: 'South Sikkim' }, { name: 'West Sikkim' }] },
    { name: 'Tripura', code: 'TR', type: 'state', districts: [{ name: 'Dhalai' }, { name: 'Gomati' }, { name: 'Khowai' }, { name: 'North Tripura' }, { name: 'Sepahijala' }, { name: 'South Tripura' }, { name: 'Unakoti' }, { name: 'West Tripura' }] },
    { name: 'Uttarakhand', code: 'UK', type: 'state', districts: [{ name: 'Almora' }, { name: 'Bageshwar' }, { name: 'Chamoli' }, { name: 'Champawat' }, { name: 'Dehradun' }, { name: 'Haridwar' }, { name: 'Nainital' }, { name: 'Pauri Garhwal' }, { name: 'Pithoragarh' }, { name: 'Rudraprayag' }, { name: 'Tehri Garhwal' }, { name: 'Udham Singh Nagar' }, { name: 'Uttarkashi' }] },

    // UNION TERRITORIES
    { name: 'Andaman and Nicobar Islands', code: 'AN', type: 'ut', districts: [{ name: 'Nicobar' }, { name: 'North and Middle Andaman' }, { name: 'South Andaman' }] },
    { name: 'Chandigarh', code: 'CH', type: 'ut', districts: [{ name: 'Chandigarh' }] },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DD', type: 'ut', districts: [{ name: 'Dadra and Nagar Haveli' }, { name: 'Daman' }, { name: 'Diu' }] },
    { name: 'Delhi', code: 'DL', type: 'ut', districts: [{ name: 'Central Delhi' }, { name: 'East Delhi' }, { name: 'New Delhi' }, { name: 'North Delhi' }, { name: 'North East Delhi' }, { name: 'North West Delhi' }, { name: 'Shahdara' }, { name: 'South Delhi' }, { name: 'South East Delhi' }, { name: 'South West Delhi' }, { name: 'West Delhi' }] },
    { name: 'Jammu and Kashmir', code: 'JK', type: 'ut', districts: [{ name: 'Anantnag' }, { name: 'Bandipora' }, { name: 'Baramulla' }, { name: 'Budgam' }, { name: 'Doda' }, { name: 'Ganderbal' }, { name: 'Jammu' }, { name: 'Kathua' }, { name: 'Kishtwar' }, { name: 'Kulgam' }, { name: 'Kupwara' }, { name: 'Poonch' }, { name: 'Pulwama' }, { name: 'Rajouri' }, { name: 'Ramban' }, { name: 'Reasi' }, { name: 'Samba' }, { name: 'Shopian' }, { name: 'Srinagar' }, { name: 'Udhampur' }] },
    { name: 'Ladakh', code: 'LA', type: 'ut', districts: [{ name: 'Kargil' }, { name: 'Leh' }] },
    { name: 'Lakshadweep', code: 'LD', type: 'ut', districts: [{ name: 'Lakshadweep' }] },
    { name: 'Puducherry', code: 'PY', type: 'ut', districts: [{ name: 'Karaikal' }, { name: 'Mahe' }, { name: 'Puducherry' }, { name: 'Yanam' }] },
];

// Helper functions
export const getAllStates = (): string[] => {
    return INDIA_GEOGRAPHY.map(s => s.name).sort();
};

export const getDistrictsByState = (stateName: string): string[] => {
    const state = INDIA_GEOGRAPHY.find(s => s.name === stateName);
    return state ? state.districts.map(d => d.name).sort() : [];
};

export const getTalukasByDistrict = (stateName: string, districtName: string): string[] => {
    const state = INDIA_GEOGRAPHY.find(s => s.name === stateName);
    if (!state) return [];
    const district = state.districts.find(d => d.name === districtName);
    return district?.talukas?.map(t => t.name).sort() || [];
};

export const getStateCode = (stateName: string): string => {
    const state = INDIA_GEOGRAPHY.find(s => s.name === stateName);
    return state?.code || '';
};

// For backward compatibility
export const INDIAN_STATES = getAllStates();
