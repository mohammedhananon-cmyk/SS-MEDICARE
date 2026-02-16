package database

import (
	"backend-core/models"
	"log"

	"gorm.io/gorm"
)

func SeedDoctorsAndHospitals(db *gorm.DB) {
	// 1. Seed Hospitals/Clinics in Kerala (Expanded List)
	hospitals := []models.Hospital{
		// Thiruvananthapuram
		{Name: "KIMSHEALTH", Location: "Trivandrum", Type: "Hospital", Rating: 4.8, Address: "P.B.No.1, Anayara, Trivandrum", ContactNumber: "0471-2940000"},
		{Name: "Cosmopolitan Hospital", Location: "Trivandrum", Type: "Hospital", Rating: 4.5, Address: "Pattom, Trivandrum", ContactNumber: "0471-2448800"},
		{Name: "SUT Hospital", Location: "Trivandrum", Type: "Hospital", Rating: 4.6, Address: "Pattom, Trivandrum", ContactNumber: "0471-4077777"},
		{Name: "PRS Hospital", Location: "Trivandrum", Type: "Hospital", Rating: 4.3, Address: "Karamana, Trivandrum", ContactNumber: "0471-2345358"},
		{Name: "Ananthapuri Hospital", Location: "Trivandrum", Type: "Hospital", Rating: 4.7, Address: "Chakkai, Trivandrum", ContactNumber: "0471-2525555"},
		{Name: "SP Fort Hospital", Location: "Trivandrum", Type: "Hospital", Rating: 4.4, Address: "Fort, Trivandrum", ContactNumber: "0471-2450540"},
		{Name: "Lords Hospital", Location: "Trivandrum", Type: "Hospital", Rating: 4.2, Address: "Anayara, Trivandrum", ContactNumber: "0471-2465466"},
		{Name: "Chaithanya Eye Hospital", Location: "Trivandrum", Type: "Hospital", Rating: 4.8, Address: "Kesavadasapuram, Trivandrum", ContactNumber: "0471-2447183"},
		{Name: "Sree Gokulam Medical College", Location: "Trivandrum", Type: "Hospital", Rating: 4.5, Address: "Venjaramoodu, Trivandrum", ContactNumber: "0472-2815000"},
		{Name: "Divya Prabha Eye Hospital", Location: "Trivandrum", Type: "Clinic", Rating: 4.6, Address: "Kumarapuram, Trivandrum", ContactNumber: "0471-2442050"},

		// Kollam
		{Name: "N.S. Memorial Institute of Medical Sciences", Location: "Kollam", Type: "Hospital", Rating: 4.6, Address: "Palathara, Kollam", ContactNumber: "0474-2729292"},
		{Name: "Bishop Benziger Hospital", Location: "Kollam", Type: "Hospital", Rating: 4.5, Address: "Beach Road, Kollam", ContactNumber: "0474-2766666"},
		{Name: "Travancore Medicity", Location: "Kollam", Type: "Hospital", Rating: 4.7, Address: "Mylapore, Kollam", ContactNumber: "0474-2729393"},
		{Name: "Upasana Hospital", Location: "Kollam", Type: "Hospital", Rating: 4.4, Address: "Chinnakada, Kollam", ContactNumber: "0474-2762400"},
		{Name: "Holy Cross Hospital", Location: "Kollam", Type: "Hospital", Rating: 4.5, Address: "Kottiyam, Kollam", ContactNumber: "0474-2530530"},
		{Name: "Azeezia Medical College Hospital", Location: "Kollam", Type: "Hospital", Rating: 4.3, Address: "Meeyannoor, Kollam", ContactNumber: "0474-2522222"},
		{Name: "Sankars Hospital", Location: "Kollam", Type: "Hospital", Rating: 4.2, Address: "Parippally, Kollam", ContactNumber: "0474-2575757"},
		{Name: "Dr. Nair's Hospital", Location: "Kollam", Type: "Hospital", Rating: 4.3, Address: "Asramam, Kollam", ContactNumber: "0474-2748484"},
		{Name: "Meditrina Hospital", Location: "Kollam", Type: "Hospital", Rating: 4.4, Address: "Ayathil, Kollam", ContactNumber: "0474-2721111"},
		{Name: "Valiyath Institute of Medical Sciences", Location: "Kollam", Type: "Hospital", Rating: 4.5, Address: "Karunagappally, Kollam", ContactNumber: "0476-2633333"},

		// Pathanamthitta
		{Name: "Pushpagiri Medical College Hospital", Location: "Pathanamthitta", Type: "Hospital", Rating: 4.6, Address: "Tiruvalla, Pathanamthitta", ContactNumber: "0469-2700755"},
		{Name: "Believers Church Medical College Hospital", Location: "Pathanamthitta", Type: "Hospital", Rating: 4.7, Address: "Tiruvalla, Pathanamthitta", ContactNumber: "0469-2742000"},
		{Name: "Muthoot Medical Centre", Location: "Pathanamthitta", Type: "Hospital", Rating: 4.4, Address: "Kozhencherry, Pathanamthitta", ContactNumber: "0468-2210500"},
		{Name: "St. Thomas Hospital", Location: "Pathanamthitta", Type: "Hospital", Rating: 4.3, Address: "Chethipuzha, Pathanamthitta", ContactNumber: "0481-2722222"}, // Near border, using Kottayam/local
		{Name: "Fellowship Mission Hospital", Location: "Pathanamthitta", Type: "Hospital", Rating: 4.2, Address: "Kumbanad, Pathanamthitta", ContactNumber: "0469-2666666"},
		{Name: "Tiruvalla Medical Mission", Location: "Pathanamthitta", Type: "Hospital", Rating: 4.5, Address: "Tiruvalla, Pathanamthitta", ContactNumber: "0469-2630300"},
		{Name: "Poyanil Hospital", Location: "Pathanamthitta", Type: "Hospital", Rating: 4.1, Address: "Kozhencherry, Pathanamthitta", ContactNumber: "0468-2212121"},

		// Alappuzha
		{Name: "KVM Hospital", Location: "Alappuzha", Type: "Hospital", Rating: 4.5, Address: "Cherthala, Alappuzha", ContactNumber: "0478-2832222"},
		{Name: "Shrudaya Hospital", Location: "Alappuzha", Type: "Hospital", Rating: 4.3, Address: "Thathampally, Alappuzha", ContactNumber: "0477-2252252"},
		{Name: "Providence Hospital", Location: "Alappuzha", Type: "Hospital", Rating: 4.4, Address: "Ala, Alappuzha", ContactNumber: "0479-2454545"},
		{Name: "Century Hospital", Location: "Alappuzha", Type: "Hospital", Rating: 4.2, Address: "Chengannur, Alappuzha", ContactNumber: "0479-2452222"},
		{Name: "Josco Multi Speciality Hospital", Location: "Alappuzha", Type: "Hospital", Rating: 4.1, Address: "Edappon, Alappuzha", ContactNumber: "0479-2453333"},
		{Name: "V.S.M Hospital", Location: "Alappuzha", Type: "Hospital", Rating: 4.0, Address: "Mavelikara, Alappuzha", ContactNumber: "0479-2303030"},
		{Name: "St. Sebastian's Hospital", Location: "Alappuzha", Type: "Hospital", Rating: 4.2, Address: "Arthunkal, Alappuzha", ContactNumber: "0478-2868686"},

		// Kottayam
		{Name: "Caritas Hospital", Location: "Kottayam", Type: "Hospital", Rating: 4.7, Address: "Thellakom, Kottayam", ContactNumber: "0481-2790025"},
		{Name: "Matha Hospital", Location: "Kottayam", Type: "Hospital", Rating: 4.5, Address: "Thellakom, Kottayam", ContactNumber: "0481-2792500"},
		{Name: "Bharath Hospital", Location: "Kottayam", Type: "Hospital", Rating: 4.6, Address: "Azad Lane, Kottayam", ContactNumber: "0481-2582888"},
		{Name: "Mandiram Hospital", Location: "Kottayam", Type: "Hospital", Rating: 4.3, Address: "Manganam, Kottayam", ContactNumber: "0481-2578578"},
		{Name: "SH Medical Centre", Location: "Kottayam", Type: "Hospital", Rating: 4.4, Address: "Nagampadam, Kottayam", ContactNumber: "0481-2562240"},
		{Name: "Mitera Hospital", Location: "Kottayam", Type: "Hospital", Rating: 4.5, Address: "Thellakom, Kottayam", ContactNumber: "0481-2791111"},
		{Name: "Indo American Hospital", Location: "Kottayam", Type: "Hospital", Rating: 4.6, Address: "Vaikom, Kottayam", ContactNumber: "04829-277777"},
		{Name: "Mar Sleeva Medicity", Location: "Kottayam", Type: "Hospital", Rating: 4.8, Address: "Palai, Kottayam", ContactNumber: "04822-269999"},
		{Name: "Marian Medical Centre", Location: "Kottayam", Type: "Hospital", Rating: 4.2, Address: "Palai, Kottayam", ContactNumber: "04822-212121"},
		{Name: "St. Thomas Hospital", Location: "Kottayam", Type: "Hospital", Rating: 4.4, Address: "Chethipuzha, Kottayam", ContactNumber: "0481-2723000"},

		// Idukki
		{Name: "St. John's Hospital", Location: "Idukki", Type: "Hospital", Rating: 4.3, Address: "Kattappana, Idukki", ContactNumber: "04868-272000"},
		{Name: "Holy Family Hospital", Location: "Idukki", Type: "Hospital", Rating: 4.4, Address: "Muthalakodam, Thodupuzha, Idukki", ContactNumber: "04862-222222"},
		{Name: "Chazhikkattu Hospital", Location: "Idukki", Type: "Hospital", Rating: 4.5, Address: "Thodupuzha, Idukki", ContactNumber: "04862-223333"},
		{Name: "Highrange Hospital", Location: "Idukki", Type: "Hospital", Rating: 4.1, Address: "Nedumkandam, Idukki", ContactNumber: "04868-232323"},
		{Name: "Morning Star Medical Centre", Location: "Idukki", Type: "Hospital", Rating: 4.2, Address: "Adimaly, Idukki", ContactNumber: "04864-222121"},
		{Name: "Tata Tea General Hospital", Location: "Idukki", Type: "Hospital", Rating: 4.6, Address: "Munnar, Idukki", ContactNumber: "04865-230300"},

		// Ernakulam (Kochi)
		{Name: "Aster Medcity", Location: "Kochi", Type: "Hospital", Rating: 4.9, Address: "Cheranalloor, Kochi", ContactNumber: "0484-6699999"},
		{Name: "Amrita Institute of Medical Sciences", Location: "Kochi", Type: "Hospital", Rating: 4.9, Address: "Ponekkara, Kochi", ContactNumber: "0484-2851234"},
		{Name: "Lisie Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.6, Address: "Kaloor, Kochi", ContactNumber: "0484-2402044"},
		{Name: "Rajagiri Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.8, Address: "Aluva, Kochi", ContactNumber: "0484-2905000"},
		{Name: "Medical Trust Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.5, Address: "MG Road, Kochi", ContactNumber: "0484-2358001"},
		{Name: "Lakeshore Hospital (VPS)", Location: "Kochi", Type: "Hospital", Rating: 4.7, Address: "Nettoor, Kochi", ContactNumber: "0484-2701032"},
		{Name: "Renai Medicity", Location: "Kochi", Type: "Hospital", Rating: 4.6, Address: "Palarivattom, Kochi", ContactNumber: "0484-2880000"},
		{Name: "Sunrise Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.4, Address: "Kakkanad, Kochi", ContactNumber: "0484-2428000"},
		{Name: "PVS Memorial Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.3, Address: "Kaloor, Kochi", ContactNumber: "0484-2405060"},
		{Name: "Gautham Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.2, Address: "Panayappilly, Kochi", ContactNumber: "0484-2220222"},
		{Name: "City Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.1, Address: "MG Road, Kochi", ContactNumber: "0484-2361361"},
		{Name: "Kinder Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.5, Address: "Pathadipalam, Kochi", ContactNumber: "0484-2848888"},
		{Name: "Specialists' Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.4, Address: "Ernakulam North, Kochi", ContactNumber: "0484-2887800"},
		{Name: "Craft Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.6, Address: "Kodungallur, Kochi", ContactNumber: "0484-2453300"},
		{Name: "Maradu Future Hospital", Location: "Kochi", Type: "Hospital", Rating: 4.0, Address: "Maradu, Kochi", ContactNumber: "0484-2808080"},

		// Thrissur
		{Name: "Jubilee Mission Medical College", Location: "Thrissur", Type: "Hospital", Rating: 4.7, Address: "East Fort, Thrissur", ContactNumber: "0487-2432200"},
		{Name: "Amala Institute of Medical Sciences", Location: "Thrissur", Type: "Hospital", Rating: 4.6, Address: "Amala Nagar, Thrissur", ContactNumber: "0487-2304000"},
		{Name: "Daya General Hospital", Location: "Thrissur", Type: "Hospital", Rating: 4.5, Address: "Shornur Road, Thrissur", ContactNumber: "0487-2200300"},
		{Name: "West Fort Hospital", Location: "Thrissur", Type: "Hospital", Rating: 4.4, Address: "West Fort, Thrissur", ContactNumber: "0487-2382100"},
		{Name: "Mother Hospital", Location: "Thrissur", Type: "Hospital", Rating: 4.3, Address: "Pullazhi, Thrissur", ContactNumber: "0487-2434000"},
		{Name: "Sun Medical and Research Centre", Location: "Thrissur", Type: "Hospital", Rating: 4.4, Address: "Thrissur", ContactNumber: "0487-2433333"},
		{Name: "Elite Mission Hospital", Location: "Thrissur", Type: "Hospital", Rating: 4.5, Address: "Koorkenchery, Thrissur", ContactNumber: "0487-2436100"},
		{Name: "Metropolitan Hospital", Location: "Thrissur", Type: "Hospital", Rating: 4.2, Address: "Kokkalai, Thrissur", ContactNumber: "0487-2422222"},
		{Name: "Craft Hospital", Location: "Thrissur", Type: "Hospital", Rating: 4.6, Address: "Kodungallur, Thrissur", ContactNumber: "0480-2800200"},
		{Name: "Trichur Heart Hospital", Location: "Thrissur", Type: "Hospital", Rating: 4.3, Address: "Sakthan Thampuran Nagar, Thrissur", ContactNumber: "0487-2445555"},
		{Name: "Modern Hospital", Location: "Thrissur", Type: "Hospital", Rating: 4.2, Address: "Kodungallur, Thrissur", ContactNumber: "0480-2801111"},

		// Palakkad
		{Name: "Thangam Hospital", Location: "Palakkad", Type: "Hospital", Rating: 4.4, Address: "Chadannamkurussi, Palakkad", ContactNumber: "0491-2515000"},
		{Name: "Avitis Institute of Medical Sciences", Location: "Palakkad", Type: "Hospital", Rating: 4.6, Address: "Nemmara, Palakkad", ContactNumber: "04923-288000"},
		{Name: "Valluvanad Hospital", Location: "Palakkad", Type: "Hospital", Rating: 4.5, Address: "Ottapalam, Palakkad", ContactNumber: "0466-2244444"},
		{Name: "PK Das Institute of Medical Sciences", Location: "Palakkad", Type: "Hospital", Rating: 4.3, Address: "Vaniamkulam, Palakkad", ContactNumber: "0466-2287777"},
		{Name: "Lakshmi Hospital", Location: "Palakkad", Type: "Hospital", Rating: 4.2, Address: "Palakkad Town", ContactNumber: "0491-2533333"},
		{Name: "Trinity Eye Hospital", Location: "Palakkad", Type: "Hospital", Rating: 4.4, Address: "Palakkad", ContactNumber: "0491-2522522"},
		{Name: "Palakkad Medical Centre", Location: "Palakkad", Type: "Hospital", Rating: 4.1, Address: "Palakkad", ContactNumber: "0491-2534444"},
		{Name: "Karuna Medical College", Location: "Palakkad", Type: "Hospital", Rating: 4.0, Address: "Chittur, Palakkad", ContactNumber: "04923-221111"},

		// Malappuram
		{Name: "MIMS Kottakkal (Aster)", Location: "Malappuram", Type: "Hospital", Rating: 4.8, Address: "Kottakkal, Malappuram", ContactNumber: "0483-2807000"},
		{Name: "Al Shifa Hospital", Location: "Malappuram", Type: "Hospital", Rating: 4.5, Address: "Perinthalmanna, Malappuram", ContactNumber: "04933-227616"},
		{Name: "Moulana Hospital", Location: "Malappuram", Type: "Hospital", Rating: 4.4, Address: "Perinthalmanna, Malappuram", ContactNumber: "04933-227206"},
		{Name: "Edappal Hospitals", Location: "Malappuram", Type: "Hospital", Rating: 4.6, Address: "Edappal, Malappuram", ContactNumber: "0494-2680100"},
		{Name: "Nadir Hospital", Location: "Malappuram", Type: "Hospital", Rating: 4.2, Address: "Manjeri, Malappuram", ContactNumber: "0483-2766666"},
		{Name: "Valluvanad Hospital", Location: "Malappuram", Type: "Hospital", Rating: 4.3, Address: "Ottapalam (Border), Malappuram", ContactNumber: "0466-2244242"},
		{Name: "MB Hospital", Location: "Malappuram", Type: "Hospital", Rating: 4.1, Address: "Malappuram", ContactNumber: "0483-2734567"},
		{Name: "Korambayil Hospital", Location: "Malappuram", Type: "Hospital", Rating: 4.2, Address: "Manjeri, Malappuram", ContactNumber: "0483-2767890"},
		{Name: "KIMS Al Shifa", Location: "Malappuram", Type: "Hospital", Rating: 4.5, Address: "Perinthalmanna, Malappuram", ContactNumber: "04933-229999"},

		// Kozhikode (Calicut)
		{Name: "Baby Memorial Hospital", Location: "Kozhikode", Type: "Hospital", Rating: 4.7, Address: "Indira Gandhi Rd, Kozhikode", ContactNumber: "0495-2777777"},
		{Name: "Aster MIMS", Location: "Kozhikode", Type: "Hospital", Rating: 4.8, Address: "Govindapuram, Kozhikode", ContactNumber: "0495-2488000"},
		{Name: "Meitra Hospital", Location: "Kozhikode", Type: "Hospital", Rating: 4.8, Address: "Karaparamba, Kozhikode", ContactNumber: "0495-7100000"},
		{Name: "Starcare Hospital", Location: "Kozhikode", Type: "Hospital", Rating: 4.5, Address: "NH Bypass, Kozhikode", ContactNumber: "0495-2464646"},
		{Name: "Iqraa International Hospital", Location: "Kozhikode", Type: "Hospital", Rating: 4.6, Address: "Wayanad Road, Kozhikode", ContactNumber: "0495-2379100"},
		{Name: "PVS Hospital", Location: "Kozhikode", Type: "Hospital", Rating: 4.3, Address: "Railway Station Rd, Kozhikode", ContactNumber: "0495-2707207"},
		{Name: "National Hospital", Location: "Kozhikode", Type: "Hospital", Rating: 4.2, Address: "Mavoor Road, Kozhikode", ContactNumber: "0495-2722222"},
		{Name: "Malabar Institute of Medical Sciences", Location: "Kozhikode", Type: "Hospital", Rating: 4.7, Address: "Mini Bypass, Kozhikode", ContactNumber: "0495-2488222"},
		{Name: "Metro International Cardiac Centre", Location: "Kozhikode", Type: "Hospital", Rating: 4.6, Address: "Thondayad, Kozhikode", ContactNumber: "0495-6611000"},
		{Name: "Fathima Hospital", Location: "Kozhikode", Type: "Hospital", Rating: 4.1, Address: "Bank Road, Kozhikode", ContactNumber: "0495-2766666"},

		// Wayanad
		{Name: "DM WIMS Series", Location: "Wayanad", Type: "Hospital", Rating: 4.6, Address: "Meppadi, Wayanad", ContactNumber: "04936-287000"},
		{Name: "Leo Hospital", Location: "Wayanad", Type: "Hospital", Rating: 4.3, Address: "Kalpetta, Wayanad", ContactNumber: "04936-202244"},
		{Name: "Fatima Mata Mission Hospital", Location: "Wayanad", Type: "Hospital", Rating: 4.2, Address: "Kalpetta, Wayanad", ContactNumber: "04936-202555"},
		{Name: "Vinayaka Hospital", Location: "Wayanad", Type: "Hospital", Rating: 4.1, Address: "Sultan Bathery, Wayanad", ContactNumber: "04936-220200"},
		{Name: "Assumption Hospital", Location: "Wayanad", Type: "Hospital", Rating: 4.4, Address: "Sultan Bathery, Wayanad", ContactNumber: "04936-220300"},

		// Kannur
		{Name: "Aster MIMS Kannur", Location: "Kannur", Type: "Hospital", Rating: 4.7, Address: "Chala, Kannur", ContactNumber: "0497-2713333"},
		{Name: "A K G Memorial Co-operative Hospital", Location: "Kannur", Type: "Hospital", Rating: 4.5, Address: "Talap, Kannur", ContactNumber: "0497-2705050"},
		{Name: "Koyili Hospital", Location: "Kannur", Type: "Hospital", Rating: 4.4, Address: "Talap, Kannur", ContactNumber: "0497-2704444"},
		{Name: "Dhanalakshmi Hospital", Location: "Kannur", Type: "Hospital", Rating: 4.3, Address: "Kannur", ContactNumber: "0497-2762200"},
		{Name: "Speciality Hospital", Location: "Kannur", Type: "Hospital", Rating: 4.2, Address: "Kannur", ContactNumber: "0497-2707777"},
		{Name: "Sreechand Speciality Hospital", Location: "Kannur", Type: "Hospital", Rating: 4.5, Address: "Kannur", ContactNumber: "0497-2708888"},
		{Name: "Tellicherry Co-operative Hospital", Location: "Kannur", Type: "Hospital", Rating: 4.4, Address: "Thalassery, Kannur", ContactNumber: "0490-2342222"},
		{Name: "Lourdes Hospital", Location: "Kannur", Type: "Hospital", Rating: 4.3, Address: "Taliparamba, Kannur", ContactNumber: "0460-2222222"},
		{Name: "Josgiri Hospital", Location: "Kannur", Type: "Hospital", Rating: 4.2, Address: "Thalassery, Kannur", ContactNumber: "0490-2321111"},
		{Name: "Indira Gandhi Co-operative Hospital", Location: "Kannur", Type: "Hospital", Rating: 4.1, Address: "Thalassery, Kannur", ContactNumber: "0490-2322322"},

		// Kasaragod
		{Name: "Carewell Hospital", Location: "Kasaragod", Type: "Hospital", Rating: 4.2, Address: "Kasaragod", ContactNumber: "04994-230032"},
		{Name: "Kanhangad District Hospital", Location: "Kasaragod", Type: "Hospital", Rating: 4.0, Address: "Kanhangad", ContactNumber: "0467-2203000"},
		{Name: "Malik Deenar Hospital", Location: "Kasaragod", Type: "Hospital", Rating: 4.3, Address: "Thalangara, Kasaragod", ContactNumber: "04994-230300"},
		{Name: "Aramana Hospital", Location: "Kasaragod", Type: "Hospital", Rating: 4.1, Address: "Kasaragod", ContactNumber: "04994-222222"},
		{Name: "United Medical Centre", Location: "Kasaragod", Type: "Hospital", Rating: 4.2, Address: "Kasaragod", ContactNumber: "04994-225555"},
		{Name: "EK Nayanar Memorial Co-operative Hospital", Location: "Kasaragod", Type: "Hospital", Rating: 4.3, Address: "Chengala, Kasaragod", ContactNumber: "04994-255555"},
	}

	for _, h := range hospitals {
		// Use Assign to update fields even if record exists
		if err := db.Where(models.Hospital{Name: h.Name, Location: h.Location}).
			Assign(models.Hospital{
				Address:       h.Address,
				ContactNumber: h.ContactNumber,
				Rating:        h.Rating,
				Type:          h.Type,
			}).
			FirstOrCreate(&h).Error; err != nil {
			log.Printf("Error seeding hospital %s: %v", h.Name, err)
		}
	}

	// 2. Seed Doctors (Expanded)
	// Helper to find hospital by name
	findHospital := func(name string) models.Hospital {
		var h models.Hospital
		// Use First to get the first match, assuming unique names per location or globally unique enough for this simulation
		db.Where("name = ?", name).First(&h)
		return h
	}

	// We define doctors with reference to hospital names. The loop below will attach IDs.
	type DoctorSeed struct {
		Name          string
		Specialty     string
		Qualification string
		Experience    int
		HospitalName  string
		Location      string // Redundant but good for double-check
		Fee           float64
		Rating        float32
		AvailableDays string // New field
	}

	doctorSeeds := []DoctorSeed{
		// KIMSHEALTH Trivandrum
		{"Dr. M. I. Sahadulla", "Internal Medicine", "MBBS, MD, FRCP", 40, "KIMSHEALTH", "Trivandrum", 1000, 5.0, "Mon,Wed,Fri"},
		{"Dr. G. Vijayaraghavan", "Cardiology", "MBBS, MD, DM", 35, "KIMSHEALTH", "Trivandrum", 1200, 4.9, "Tue,Thu,Sat"},
		{"Dr. P. M. Venugopal", "Pulmonology", "MBBS, MD, DTCD", 25, "KIMSHEALTH", "Trivandrum", 900, 4.8, "Mon,Tue,Wed,Thu,Fri"},
		{"Dr. Zuhara P. M.", "Gynecology", "MBBS, MD, DGO", 20, "KIMSHEALTH", "Trivandrum", 800, 4.7, "Mon,Wed,Fri,Sat"},
		{"Dr. Bashi V. Velayudhan", "Cardiothoracic Surgery", "MBBS, MS, MCh", 30, "KIMSHEALTH", "Trivandrum", 1500, 4.9, "Tue,Thu"},
		{"Dr. James Thomas", "Orthopedics", "MBBS, MS", 18, "KIMSHEALTH", "Trivandrum", 950, 4.8, "Mon,Wed,Fri"},
		{"Dr. R. C. Sreekumar", "Neurology", "MBBS, DM", 22, "KIMSHEALTH", "Trivandrum", 1100, 4.7, "Tue,Thu,Sat"},

		// Cosmopolitan Trivandrum
		{"Dr. K. P. Paul", "General Surgery", "MBBS, MS", 28, "Cosmopolitan Hospital", "Trivandrum", 600, 4.5, "Mon,Tue,Wed,Thu,Fri"},
		{"Dr. S. K. Nair", "Orthopedics", "MBBS, MS (Ortho)", 15, "Cosmopolitan Hospital", "Trivandrum", 700, 4.4, "Mon,Wed,Fri"},
		{"Dr. Geetha Devi", "Pediatrics", "MBBS, DCH", 12, "Cosmopolitan Hospital", "Trivandrum", 500, 4.6, "Tue,Thu,Sat"},
		{"Dr. Pradeep Kumar", "ENT", "MBBS, MS (ENT)", 18, "Cosmopolitan Hospital", "Trivandrum", 550, 4.3, "Mon,Wed,Fri,Sat"},
		{"Dr. Anitha S.", "Dermatology", "MBBS, MD", 10, "Cosmopolitan Hospital", "Trivandrum", 500, 4.4, "Tue,Thu"},

		// Ananthapuri Trivandrum
		{"Dr. A. Marthanda Pillai", "Neurology", "MBBS, MD, DM", 38, "Ananthapuri Hospital", "Trivandrum", 1100, 4.8, "Mon,Tue,Wed,Thu"},
		{"Dr. C. G. Bahuleyan", "Cardiology", "MBBS, MD, DM", 40, "Ananthapuri Hospital", "Trivandrum", 1000, 4.9, "Wed,Fri,Sat"},
		{"Dr. S. R. Chandra", "Gastroenterology", "MBBS, DM", 20, "Ananthapuri Hospital", "Trivandrum", 900, 4.7, "Mon,Tue,Thu,Fri"},

		// SUT Hospital Trivandrum
		{"Dr. K. P. Haridas", "General Surgery", "MBBS, MS", 30, "SUT Hospital", "Trivandrum", 800, 4.6, "Mon,Wed,Fri"},
		{"Dr. N. M. Sharief", "Cardiology", "MBBS, DM", 25, "SUT Hospital", "Trivandrum", 900, 4.7, "Tue,Thu,Sat"},
		{"Dr. Beena Unnikrishnan", "Gynecology", "MBBS, DGO", 20, "SUT Hospital", "Trivandrum", 750, 4.5, "Mon,Tue,Wed,Thu,Fri,Sat"},

		// Lords Hospital
		{"Dr. Harish Chandran", "General Medicine", "MBBS, MD", 15, "Lords Hospital", "Trivandrum", 500, 4.4, "Mon-Sat"},

		// Chaithanya Eye Hospital
		{"Dr. K. Mahadevan", "Ophthalmology", "MBBS, MS", 25, "Chaithanya Eye Hospital", "Trivandrum", 600, 4.8, "Mon,Wed,Fri"},

		// Aster Medcity Kochi
		{"Dr. Harish Kumar", "Cardiology", "MBBS, MD, DM", 15, "Aster Medcity", "Kochi", 1200, 4.9, "Mon-Sat"},
		{"Dr. Mathew Abraham", "Neurology", "MBBS, MD, DM", 25, "Aster Medcity", "Kochi", 1300, 4.9, "Tue,Thu,Sat"},
		{"Dr. V. Narayanan Unni", "Nephrology", "MBBS, MD, DM", 30, "Aster Medcity", "Kochi", 1100, 4.8, "Mon,Wed,Fri"},
		{"Dr. I. V. Sivakumar", "Cardiology", "MBBS, MD, DM", 20, "Aster Medcity", "Kochi", 1200, 4.8, "Mon,Tue,Thu,Fri"},
		{"Dr. Mayank Nair", "Gastroenterology", "MBBS, MD, DM", 16, "Aster Medcity", "Kochi", 1000, 4.7, "Wed,Fri,Sat"},
		{"Dr. Donna George", "Dermatology", "MBBS, MD, DDVL", 10, "Aster Medcity", "Kochi", 900, 4.6, "Tue,Thu"},
		{"Dr. T. R. John", "Psychiatry", "MBBS, MD, DPM", 22, "Aster Medcity", "Kochi", 1000, 4.8, "Mon,Wed,Fri"},
		{"Dr. Jeffy George", "Dental", "BDS, MDS", 8, "Aster Medcity", "Kochi", 600, 4.5, "Mon-Sat"},
		{"Dr. Vijayakumar K.", "Oncology", "MBBS, DM", 18, "Aster Medcity", "Kochi", 1300, 4.8, "Tue,Thu,Sat"},
		{"Dr. Magna G.", "Pediatrics", "MBBS, MD", 12, "Aster Medcity", "Kochi", 850, 4.7, "Mon,Wed,Fri"},

		// Amrita Kochi
		{"Dr. Prem Nair", "Gastroenterology", "MBBS, MD, DM", 35, "Amrita Institute of Medical Sciences", "Kochi", 1200, 4.9, "Mon-Fri"},
		{"Dr. R. Krishna Kumar", "Pediatric Cardiology", "MBBS, MD, DM", 28, "Amrita Institute of Medical Sciences", "Kochi", 1300, 4.9, "Mon,Wed,Fri"},
		{"Dr. Sheela Nampoothiri", "Pediatric Genetics", "MBBS, DCH, DNB", 20, "Amrita Institute of Medical Sciences", "Kochi", 900, 4.7, "Tue,Thu"},
		{"Dr. Subramania Iyer", "Plastic Surgery", "MBBS, MS, MCh", 30, "Amrita Institute of Medical Sciences", "Kochi", 1500, 4.9, "Wed,Fri"},
		{"Dr. K. U. Natarajan", "Cardiology", "MBBS, MD, DM", 25, "Amrita Institute of Medical Sciences", "Kochi", 1100, 4.8, "Mon,Tue,Thu,Fri"},
		{"Dr. Sanjeev Singh", "Pediatrics", "MBBS, MD", 22, "Amrita Institute of Medical Sciences", "Kochi", 950, 4.7, "Mon-Sat"},
		{"Dr. AnandKumar", "Neurology", "MBBS, DM", 26, "Amrita Institute of Medical Sciences", "Kochi", 1100, 4.8, "Tue,Thu,Sat"},

		// Lisie Kochi
		{"Dr. Jose Chacko Periappuram", "Cardiothoracic Surgery", "MBBS, FRCS", 30, "Lisie Hospital", "Kochi", 1000, 4.8, "Mon,Wed,Fri"},
		{"Dr. Rony Mathew", "Cardiology", "MBBS, MD, DM", 20, "Lisie Hospital", "Kochi", 900, 4.7, "Tue,Thu,Sat"},
		{"Dr. Babu Francis", "Neurology", "MBBS, MD, DM", 18, "Lisie Hospital", "Kochi", 900, 4.6, "Mon,Tue,Wed,Thu,Fri"},
		{"Dr. Kochu Thresiamma", "Gynecology", "MBBS, MD, DGO", 25, "Lisie Hospital", "Kochi", 700, 4.8, "Mon,Wed,Fri,Sat"},
		{"Dr. Subramanian", "General Medicine", "MBBS, MD", 28, "Lisie Hospital", "Kochi", 600, 4.5, "Mon-Sat"},

		// Rajagiri Kochi
		{"Dr. V. P. Paily", "Gynecology", "MBBS, MD, FRCOG", 40, "Rajagiri Hospital", "Kochi", 1000, 4.9, "Tue,Thu,Sat"},
		{"Dr. Sunny P. Orathel", "Internal Medicine", "MBBS, MD", 25, "Rajagiri Hospital", "Kochi", 800, 4.7, "Mon,Wed,Fri"},
		{"Dr. Jacob George", "Nephrology", "MBBS, MD, DM", 20, "Rajagiri Hospital", "Kochi", 900, 4.8, "Mon,Tue,Thu,Fri"},
		{"Dr. Biju Pottakkat", "Gastro Surgery", "MBBS, MS, MCh", 18, "Rajagiri Hospital", "Kochi", 1100, 4.8, "Wed,Fri,Sat"},
		{"Dr. Rijo Mathew", "Pulmonology", "MBBS, MD", 12, "Rajagiri Hospital", "Kochi", 800, 4.6, "Tue,Thu"},

		// Medical Trust Kochi
		{"Dr. P. V. Louis", "Neurology", "MBBS, DM", 30, "Medical Trust Hospital", "Kochi", 900, 4.7, "Mon,Wed,Fri"},
		{"Dr. K. K. Mubarak", "Urology", "MBBS, MCh", 25, "Medical Trust Hospital", "Kochi", 950, 4.6, "Tue,Thu,Sat"},

		// Lakeshore Kochi
		{"Dr. Philip Augustine", "Gastroenterology", "MBBS, MD, DM", 40, "Lakeshore Hospital (VPS)", "Kochi", 1400, 4.9, "Mon,Tue,Wed"},
		{"Dr. Gangadharan", "Oncology", "MBBS, MD", 35, "Lakeshore Hospital (VPS)", "Kochi", 1300, 4.9, "Thu,Fri,Sat"},
		{"Dr. Moideen", "Cardiology", "MBBS, DM", 20, "Lakeshore Hospital (VPS)", "Kochi", 1200, 4.7, "Mon,Wed,Fri"},

		// Baby Memorial Kozhikode
		{"Dr. K. G. Alexander", "Nephrology", "MBBS, MD, DM", 35, "Baby Memorial Hospital", "Kozhikode", 1000, 4.8, "Mon,Wed,Fri"},
		{"Dr. Vinod Kumar", "Neurology", "MBBS, MD, DM", 22, "Baby Memorial Hospital", "Kozhikode", 900, 4.7, "Tue,Thu,Sat"},
		{"Dr. Saji Kumar", "Orthopedics", "MBBS, MS, MCh", 18, "Baby Memorial Hospital", "Kozhikode", 850, 4.6, "Mon,Tue,Thu,Fri"},
		{"Dr. Anitha N", "Pediatrics", "MBBS, MD", 15, "Baby Memorial Hospital", "Kozhikode", 600, 4.5, "Mon-Sat"},
		{"Dr. Abraham Mammen", "Urology", "MBBS, MS, MCh", 28, "Baby Memorial Hospital", "Kozhikode", 950, 4.7, "Wed,Fri,Sat"},
		{"Dr. Shamsudheen", "General Medicine", "MBBS, MD", 20, "Baby Memorial Hospital", "Kozhikode", 600, 4.5, "Mon,Wed,Fri"},

		// MIMS Kozhikode (Aster)
		{"Dr. Abdulla Cherayakkat", "Cardiology", "MBBS, MD, DM", 20, "Aster MIMS", "Kozhikode", 1100, 4.8, "Mon,Tue,Wed,Thu,Fri"},
		{"Dr. Venugopal P. P.", "Emergency Medicine", "MBBS, MEM", 15, "Aster MIMS", "Kozhikode", 800, 4.9, "Mon-Sun"},
		{"Dr. Hamza Tayyil", "Oncology", "MBBS, MD, DM", 25, "Aster MIMS", "Kozhikode", 1200, 4.8, "Tue,Thu,Sat"},
		{"Dr. Santy Sajan", "Gynecology", "MBBS, MD, DGO", 18, "Aster MIMS", "Kozhikode", 900, 4.7, "Mon,Wed,Fri"},
		{"Dr. Sudheer", "Neurology", "MBBS, DM", 15, "Aster MIMS", "Kozhikode", 1000, 4.7, "Tue,Thu"},

		// Meitra Kozhikode
		{"Dr. Ali Faizal", "Cardiology", "MBBS, MD, DM", 30, "Meitra Hospital", "Kozhikode", 1300, 4.8, "Mon,Wed,Fri"},
		{"Dr. P. Mohanan", "Orthopedics", "MBBS, MS", 25, "Meitra Hospital", "Kozhikode", 1100, 4.7, "Tue,Thu,Sat"},
		{"Dr. George Abraham", "Urology", "MBBS, MS, MCh", 15, "Meitra Hospital", "Kozhikode", 1000, 4.8, "Mon,Tue,Thu,Fri"},

		// Iqraa Kozhikode
		{"Dr. P. C. Anwar", "General Medicine", "MBBS, MD", 18, "Iqraa International Hospital", "Kozhikode", 500, 4.5, "Mon-Sat"},
		{"Dr. Firoz", "Dermatology", "MBBS, MD", 12, "Iqraa International Hospital", "Kozhikode", 450, 4.4, "Mon,Wed,Fri"},

		// Caritas Kottayam
		{"Dr. Thomas Chandy", "Pediatrics", "MBBS, DCH", 25, "Caritas Hospital", "Kottayam", 600, 4.6, "Mon,Wed,Fri"},
		{"Dr. Jenny Joseph", "Dermatology", "MBBS, MD", 12, "Caritas Hospital", "Kottayam", 550, 4.5, "Tue,Thu,Sat"},
		{"Dr. Reji Paul", "Cardiology", "MBBS, MD, DM", 18, "Caritas Hospital", "Kottayam", 800, 4.7, "Mon,Tue,Thu,Fri"},
		{"Dr. Jose Tom", "Gastroenterology", "MBBS, DM", 15, "Caritas Hospital", "Kottayam", 750, 4.6, "Wed,Fri,Sat"},

		// Matha Kottayam
		{"Dr. Kurian Thomas", "Ophthalmology", "MBBS, MS (Ophtha)", 20, "Matha Hospital", "Kottayam", 500, 4.8, "Mon,Wed,Fri"},
		{"Dr. Sarah Jacob", "General Medicine", "MBBS, MD", 15, "Matha Hospital", "Kottayam", 500, 4.4, "Tue,Thu,Sat"},

		// Mar Sleeva Kottayam
		{"Dr. Jacob K. Jacob", "Internal Medicine", "MBBS, MD", 30, "Mar Sleeva Medicity", "Kottayam", 800, 4.8, "Mon-Sat"},
		{"Dr. Benu J", "Cardiology", "MBBS, MD, DM", 15, "Mar Sleeva Medicity", "Kottayam", 900, 4.7, "Mon,Wed,Fri"},
		{"Dr. Sr. Dr. Ancy", "Gynecology", "MBBS, DGO", 25, "Mar Sleeva Medicity", "Kottayam", 600, 4.5, "Tue,Thu,Sat"},

		// Jubilee Mission Thrissur
		{"Dr. Benny Joseph", "Orthopedics", "MBBS, MS", 25, "Jubilee Mission Medical College", "Thrissur", 700, 4.6, "Mon,Wed,Fri"},
		{"Dr. Gilvaz", "Gynecology", "MBBS, MD, DGO", 35, "Jubilee Mission Medical College", "Thrissur", 750, 4.8, "Tue,Thu,Sat"},
		{"Dr. Praveen G. Pai", "Cardiology", "MBBS, MD, DM", 20, "Jubilee Mission Medical College", "Thrissur", 850, 4.7, "Mon,Tue,Thu,Fri"},
		{"Dr. T. V. Rappai", "Neurology", "MBBS, DM", 28, "Jubilee Mission Medical College", "Thrissur", 800, 4.7, "Wed,Fri,Sat"},

		// Amala Thrissur
		{"Dr. K. R. Madhavan", "Oncology", "MBBS, MD, DM", 30, "Amala Institute of Medical Sciences", "Thrissur", 900, 4.8, "Mon,Wed,Fri"},
		{"Dr. Haridas", "Neurology", "MBBS, MD, DM", 25, "Amala Institute of Medical Sciences", "Thrissur", 850, 4.7, "Tue,Thu"},
		{"Dr. Ajit Kumar", "Cardiology", "MBBS, DM", 22, "Amala Institute of Medical Sciences", "Thrissur", 800, 4.6, "Mon,Wed,Fri,Sat"},

		// Thrissur Heart Hospital
		{"Dr. P. P. Mohanan", "Cardiology", "MBBS, DM", 28, "Trichur Heart Hospital", "Thrissur", 900, 4.7, "Mon-Sat"},

		// Daya Thrissur
		{"Dr. V. K. Abdul Azeez", "General Surgery", "MBBS, MS", 22, "Daya General Hospital", "Thrissur", 600, 4.5, "Mon,Wed,Fri"},
		{"Dr. V. S. Rajeev", "Urology", "MBBS, MCh", 15, "Daya General Hospital", "Thrissur", 700, 4.4, "Tue,Thu,Sat"},

		// Palakkad Hospitals
		{"Dr. P. B. Gujral", "General Surgery", "MBBS, MS", 30, "Thangam Hospital", "Palakkad", 600, 4.4, "Mon-Fri"},
		{"Dr. Ramkumar", "Neurology", "MBBS, DM", 15, "Thangam Hospital", "Palakkad", 800, 4.5, "Tue,Thu,Sat"},
		{"Dr. Unnikrishnan", "Cardiology", "MBBS, MD, DM", 20, "Valluvanad Hospital", "Palakkad", 750, 4.5, "Mon,Wed,Fri"},
		{"Dr. Suresh Kumar", "Pediatrics", "MBBS, MD", 15, "PK Das Institute of Medical Sciences", "Palakkad", 550, 4.3, "Mon,Tue,Thu,Fri"},
		{"Dr. Jyothi", "Gynecology", "MBBS, DGO", 12, "Lakshmi Hospital", "Palakkad", 500, 4.2, "Wed,Fri,Sat"},
		{"Dr. Sundaram", "Ophthalmology", "MBBS, MS", 20, "Trinity Eye Hospital", "Palakkad", 450, 4.6, "Mon-Sat"},

		// Kannur Hospitals
		{"Dr. Murali Krishna", "Cardiology", "MBBS, MD, DM", 18, "Aster MIMS Kannur", "Kannur", 900, 4.7, "Mon,Wed,Fri"},
		{"Dr. Sudha S.", "Gynecology", "MBBS, MD", 25, "Koyili Hospital", "Kannur", 650, 4.4, "Tue,Thu,Sat"},
		{"Dr. Rajeev N.", "Orthopedics", "MBBS, MS", 20, "A K G Memorial Co-operative Hospital", "Kannur", 600, 4.5, "Mon,Tue,Wed,Thu,Fri"},
		{"Dr. Ashraf", "Pediatrics", "MBBS, DCH", 15, "A K G Memorial Co-operative Hospital", "Kannur", 500, 4.3, "Sat"},
		{"Dr. Simi", "Dermatology", "MBBS, MD", 8, "Aster MIMS Kannur", "Kannur", 600, 4.4, "Mon,Wed,Fri"},

		// Kasaragod
		{"Dr. Satheesh Kumar", "General Medicine", "MBBS, MD", 15, "Carewell Hospital", "Kasaragod", 400, 4.2, "Mon-Sat"},
		{"Dr. Abdul Rahman", "Pediatrics", "MBBS, DCH", 12, "Malik Deenar Hospital", "Kasaragod", 350, 4.3, "Tue,Thu,Sat"},
		{"Dr. Ahmed", "General Surgery", "MBBS, MS", 10, "Malik Deenar Hospital", "Kasaragod", 450, 4.2, "Mon,Wed,Fri"},

		// Wayanad
		{"Dr. Moosa Kunhi", "General Surgery", "MBBS, MS", 20, "DM WIMS Series", "Wayanad", 500, 4.6, "Mon,Wed,Fri"},
		{"Dr. Mary Varghese", "Gynecology", "MBBS, DGO", 18, "Leo Hospital", "Wayanad", 450, 4.3, "Tue,Thu,Sat"},
		{"Dr. Manoj", "Orthopedics", "MBBS, MS", 12, "DM WIMS Series", "Wayanad", 600, 4.4, "Mon,Tue,Thu,Fri"},
		{"Dr. Raveendran", "General Medicine", "MBBS, MD", 25, "Vinayaka Hospital", "Wayanad", 400, 4.2, "Wed,Fri,Sat"},

		// Kollam
		{"Dr. N. S. Sreedevi", "Gynecology", "MBBS, DGO", 30, "N.S. Memorial Institute of Medical Sciences", "Kollam", 600, 4.6, "Mon,Wed,Fri"},
		{"Dr. R. V. Ashokan", "General Medicine", "MBBS, MD", 25, "N.S. Memorial Institute of Medical Sciences", "Kollam", 500, 4.5, "Tue,Thu,Sat"},
		{"Dr. Joseph John", "Cardiology", "MBBS, DM", 20, "Bishop Benziger Hospital", "Kollam", 800, 4.6, "Mon,Tue,Thu,Fri"},
		{"Dr. Alexander", "Orthopedics", "MBBS, MS", 18, "Bishop Benziger Hospital", "Kollam", 700, 4.5, "Wed,Fri,Sat"},
		{"Dr. N. Roy", "Urology", "MBBS, MCh", 22, "Travancore Medicity", "Kollam", 900, 4.7, "Mon-Sat"},
		{"Dr. Manju", "Pediatrics", "MBBS, MD", 15, "Travancore Medicity", "Kollam", 600, 4.6, "Tue,Thu"},
		{"Dr. Prathap Kumar", "Cardiology", "MBBS, DM", 25, "Meditrina Hospital", "Kollam", 950, 4.8, "Mon,Wed,Fri"},

		// Pathanamthitta
		{"Dr. Abraham Varghese", "General Surgery", "MBBS, MS", 30, "Pushpagiri Medical College Hospital", "Pathanamthitta", 700, 4.6, "Mon,Wed,Fri"},
		{"Dr. Lizy Abraham", "Gynecology", "MBBS, MD", 25, "Pushpagiri Medical College Hospital", "Pathanamthitta", 650, 4.7, "Tue,Thu,Sat"},
		{"Dr. George Chandy", "Gastroenterology", "MBBS, DM", 35, "Believers Church Medical College Hospital", "Pathanamthitta", 900, 4.8, "Mon,Tue,Thu,Fri"},
		{"Dr. Jacob Punnoose", "General Medicine", "MBBS, MD", 28, "Believers Church Medical College Hospital", "Pathanamthitta", 600, 4.7, "Wed,Fri,Sat"},
		{"Dr. P. T. Thomas", "Orthopedics", "MBBS, MS", 20, "Muthoot Medical Centre", "Pathanamthitta", 600, 4.5, "Mon-Sat"},

		// Alappuzha
		{"Dr. V. Narayanan", "General Medicine", "MBBS, MD", 30, "KVM Hospital", "Alappuzha", 500, 4.4, "Mon-Fri"},
		{"Dr. Deepa", "Gynecology", "MBBS, DGO", 15, "KVM Hospital", "Alappuzha", 450, 4.3, "Tue,Thu"},
		{"Dr. Thomas Mathew", "Pediatrics", "MBBS, MD", 20, "Providence Hospital", "Alappuzha", 400, 4.4, "Mon-Sat"},
		{"Dr. Soman", "Cardiology", "MBBS, DM", 18, "Century Hospital", "Alappuzha", 700, 4.3, "Mon,Wed,Fri"},

		// New Additions to fill gaps
		{"Dr. Roshni", "Dermatology", "MBBS, MD", 10, "City Hospital", "Kochi", 450, 4.3, "Mon,Tue,Wed"},
		{"Dr. Kiran", "General Medicine", "MBBS, MD", 12, "Highrange Hospital", "Idukki", 400, 4.2, "Mon-Sat"},
		{"Dr. Beena", "Gynecology", "MBBS, DGO", 15, "Highrange Hospital", "Idukki", 450, 4.3, "Tue,Thu,Sat"},
		{"Dr. Peter", "Orthopedics", "MBBS, MS", 20, "St. John's Hospital", "Idukki", 500, 4.4, "Mon,Wed,Fri"},
		{"Dr. Reshma", "Pediatrics", "MBBS, DCH", 8, "Jubilee Mission Medical College", "Thrissur", 550, 4.5, "Mon-Sat"},

		// --- NEW ADDITIONS TO POPULATE EMPTY HOSPITALS ---

		// Valiyath Institute of Medical Sciences, Kollam
		{"Dr. Sreekanth", "General Medicine", "MBBS, MD", 12, "Valiyath Institute of Medical Sciences", "Kollam", 400, 4.3, "Mon,Wed,Fri"},
		{"Dr. Meera N.", "Gynecology", "MBBS, DGO", 15, "Valiyath Institute of Medical Sciences", "Kollam", 450, 4.4, "Tue,Thu,Sat"},
		{"Dr. Ravi Kumar", "Orthopedics", "MBBS, MS", 18, "Valiyath Institute of Medical Sciences", "Kollam", 500, 4.5, "Mon-Sat"},

		// Pushpagiri Medical College Hospital (Adding more)
		{"Dr. Mathews John", "Cardiology", "MBBS, DM", 22, "Pushpagiri Medical College Hospital", "Pathanamthitta", 800, 4.7, "Mon,Tue,Thu,Fri"},
		{"Dr. Susan Thomas", "Pediatrics", "MBBS, MD", 10, "Pushpagiri Medical College Hospital", "Pathanamthitta", 500, 4.5, "Mon,Wed,Sat"},
		{"Dr. Philip George", "Neurology", "MBBS, DM", 25, "Pushpagiri Medical College Hospital", "Pathanamthitta", 900, 4.8, "Tue,Thu"},

		// Meditrina Hospital, Kollam (Adding more)
		{"Dr. Anjali R.", "Dermatology", "MBBS, MD", 8, "Meditrina Hospital", "Kollam", 400, 4.4, "Wed,Fri"},
		{"Dr. Suresh G.", "Gastroenterology", "MBBS, DM", 20, "Meditrina Hospital", "Kollam", 850, 4.6, "Mon,Tue,Thu"},

		// Holy Cross Hospital, Kollam
		{"Dr. George Kurian", "General Surgery", "MBBS, MS", 25, "Holy Cross Hospital", "Kollam", 600, 4.5, "Mon-Fri"},
		{"Dr. Latha P.", "General Medicine", "MBBS, MD", 15, "Holy Cross Hospital", "Kollam", 450, 4.3, "Tue,Thu,Sat"},

		// Azeezia Medical College Hospital, Kollam
		{"Dr. Harish Menon", "ENT", "MBBS, MS", 12, "Azeezia Medical College Hospital", "Kollam", 400, 4.2, "Mon,Wed,Fri"},
		{"Dr. Smitha K.", "Ophthalmology", "MBBS, MS", 14, "Azeezia Medical College Hospital", "Kollam", 450, 4.4, "Tue,Thu,Sat"},

		// Upasana Hospital, Kollam
		{"Dr. Balan K.", "Orthopedics", "MBBS, MS", 28, "Upasana Hospital", "Kollam", 600, 4.5, "Mon-Sat"},
		{"Dr. Sheela S.", "Gynecology", "MBBS, DGO", 20, "Upasana Hospital", "Kollam", 500, 4.4, "Mon,Wed,Fri"},

		// Sankars Hospital, Kollam
		{"Dr. Ramesh Ibqubal", "General Medicine", "MBBS, MD", 10, "Sankars Hospital", "Kollam", 350, 4.1, "Mon-Sat"},

		// Dr. Nair's Hospital, Kollam
		{"Dr. Vivek Nair", "Psychiatry", "MBBS, MD", 15, "Dr. Nair's Hospital", "Kollam", 500, 4.4, "Mon,Wed,Fri"},

		// Muthoot Medical Centre, Pathanamthitta (Adding more)
		{"Dr. Varghese Paul", "Cardiology", "MBBS, DM", 20, "Muthoot Medical Centre", "Pathanamthitta", 800, 4.6, "Tue,Thu,Sat"},
		{"Dr. Ann Mary", "Dermatology", "MBBS, MD", 8, "Muthoot Medical Centre", "Pathanamthitta", 450, 4.3, "Mon,Wed,Fri"},

		// St. Thomas Hospital, Pathanamthitta
		{"Dr. Thomas K. T.", "General Surgery", "MBBS, MS", 22, "St. Thomas Hospital", "Pathanamthitta", 600, 4.5, "Mon-Fri"},

		// Fellowship Mission Hospital, Pathanamthitta
		{"Dr. Samuel", "General Medicine", "MBBS, MD", 30, "Fellowship Mission Hospital", "Pathanamthitta", 400, 4.2, "Mon-Sat"},

		// Tiruvalla Medical Mission
		{"Dr. Cherian", "Pediatrics", "MBBS, DCH", 18, "Tiruvalla Medical Mission", "Pathanamthitta", 500, 4.4, "Tue,Thu,Sat"},

		// Poyanil Hospital
		{"Dr. Mathew Poyanil", "General Medicine", "MBBS, MD", 35, "Poyanil Hospital", "Pathanamthitta", 450, 4.3, "Mon,Wed,Fri"},

		// KVM Hospital, Alappuzha (Adding more)
		{"Dr. Sunil Kumar", "Orthopedics", "MBBS, MS", 15, "KVM Hospital", "Alappuzha", 550, 4.4, "Mon-Sat"},

		// Shrudaya Hospital, Alappuzha
		{"Dr. Francis", "Cardiology", "MBBS, DM", 25, "Shrudaya Hospital", "Alappuzha", 700, 4.5, "Tue,Thu,Sat"},

		// Century Hospital, Alappuzha (Adding more)
		{"Dr. Lakshmi", "Gynecology", "MBBS, DGO", 12, "Century Hospital", "Alappuzha", 450, 4.3, "Mon,Wed,Fri"},

		// St. Sebastian's Hospital, Alappuzha
		{"Dr. Sebastian", "General Medicine", "MBBS, MD", 20, "St. Sebastian's Hospital", "Alappuzha", 400, 4.2, "Mon-Sat"},
	}

	for _, d := range doctorSeeds {
		h := findHospital(d.HospitalName)
		if h.ID == 0 {
			log.Printf("Warning: Hospital not found for doctor seeding: %s", d.HospitalName)
			continue
		}

		doctor := models.Doctor{
			Name:            d.Name,
			Specialty:       d.Specialty,
			Qualification:   d.Qualification,
			Experience:      d.Experience,
			HospitalID:      h.ID,
			HospitalName:    h.Name,
			ConsultationFee: d.Fee,
			Location:        h.Location,      // Use hospital location
			AvailableDays:   d.AvailableDays, // New field
			Rating:          d.Rating,
		}

		if err := db.Where(models.Doctor{Name: doctor.Name, HospitalID: doctor.HospitalID}).
			Assign(models.Doctor{AvailableDays: d.AvailableDays}). // Ensure this updates on re-run
			FirstOrCreate(&doctor).Error; err != nil {
			log.Printf("Error seeding doctor %s: %v", doctor.Name, err)
		}
	}
}
