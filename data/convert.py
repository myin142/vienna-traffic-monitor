
STOPS_FILE = 'wienerlinien-ogd-haltestellen.csv'
STEIG_FILE = 'wienerlinien-ogd-steige.csv'
HALTEPUNKTE_FILE = 'wienerlinien-ogd-haltepunkte.csv'

OUTPUT_FILE = 'stops.csv'

# stop_data = {}
# with open(STOPS_FILE) as stops:
#     stops.readline() # Header

#     for stop in stops.readlines():
#         stop = stop.split(';')
#         stop_data[stop[0]] = stop[3]

# with open(OUTPUT_FILE, 'w') as output:
#     with open(STEIG_FILE) as steige:
#         steige.readline() # Header

#         output.write(f'steig_id;stop_id;name;rbl;direction\n')
#         for steig in steige.readlines():
#             steig_row = steig.split(';')
#             output.write(f'{steig_row[0]};{steig_row[2]};{stop_data[steig_row[2]]};{steig_row[5]};{steig_row[3]}\n')

with open(OUTPUT_FILE, 'w') as output:
    with open(HALTEPUNKTE_FILE, 'r') as stops:
        stops.readline() # Header

        # output.write('stop_id;name;lat;long\n')
        for stop in stops.readlines():
            stop_row = stop.split(';')

            id = stop_row[0]
            name = stop_row[2]
            lat = stop_row[5]
            long = stop_row[6].replace('\n', '')

            if lat == '' or long == '':
                continue

            output.write(f'{id};{name};{lat};{long}\n')