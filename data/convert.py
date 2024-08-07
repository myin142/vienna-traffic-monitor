
STOPS_FILE = 'wienerlinien-ogd-haltestellen.csv'
STEIG_FILE = 'wienerlinien-ogd-steige.csv'

OUTPUT_FILE = 'stops.csv'

stop_data = {}
with open(STOPS_FILE) as stops:
    stops.readline() # Header

    for stop in stops.readlines():
        stop = stop.split(';')
        stop_data[stop[0]] = stop[3]

with open(OUTPUT_FILE, 'w') as output:
    with open(STEIG_FILE) as steige:
        steige.readline() # Header

        output.write(f'steig_id;stop_id;name;rbl;direction\n')
        for steig in steige.readlines():
            steig_row = steig.split(';')
            output.write(f'{steig_row[0]};{steig_row[2]};{stop_data[steig_row[2]]};{steig_row[5]};{steig_row[3]}\n')