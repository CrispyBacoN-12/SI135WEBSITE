export default function Calendar() {
  return (
  <section className="container max-w-screen-2xl flex flex-col gap-2 px-10 max-w-8xl mx-auto">
      <span className="font-bold text-lg">Calendar</span>
      <div className="flex gap-2 items-center flex-wrap">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=0edf3de872c14ef7b341692d8df9ca88bc84774cd4ca32efe312a1535d6c3443@group.calendar.google.com&ctz=Asia/Bangkok"
          className="w-full aspect-video border rounded-md"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </div>
    </section>
  );
}
