public class BusScheduleCache {
	private Cache.OrgPartition part;
    
    public BusScheduleCache(){
        part = Cache.Org.getPartition('local.BusSchedule');
    }

    public void putSchedule(String busLine, Time[] schedule) {
        part.put(busLine, schedule);
    }
    
    public Time[] getSchedule(String busLine) {
    	List<Time> cacheSched = (List<Time>)part.get(busLine);
        if (cacheSched == null) {
            cacheSched = new List<Time>();
            cacheSched.add(Time.newInstance(8, 0, 0, 0));
            cacheSched.add(Time.newInstance(17, 0, 0, 0));
        } 
        return cacheSched;
    }
    
}