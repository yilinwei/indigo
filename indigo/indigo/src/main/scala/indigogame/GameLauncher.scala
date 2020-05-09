package indigogame

import scala.scalajs.js.annotation._
import scala.scalajs.js.Dictionary

trait GameLauncher {

  protected def ready(flags: Map[String, String]): Unit

  @SuppressWarnings(Array("org.wartremover.warts.Any"))
  @JSExport
  def launch(): Unit =
    ready(Map[String, String]())

  @SuppressWarnings(Array("org.wartremover.warts.Any"))
  @JSExport
  def launch(flags: Dictionary[String]): Unit =
    ready(flags.toMap)

}
