---
sidebarDepth: 0
---

# 异常机制

[[toc]]

## unchecked异常和checked异常

- unchecked异常即RuntimeException（运行时异常），不需要try...catch...或throws 机制去处理的异常
- 除了RuntimeException，其他继承自java.lang.Exception得异常统称为Checked Exception
- JDK常见的异常分类
  - 继承关系：java.lang.Object <-- java.lang.Throwable <--java.lang.Exception
  - 所有已实现的接口: Serializable
  - 直接已知子类:
>AclNotFoundException, ActivationException, AlreadyBoundException, ApplicationException, AWTException, BackingStoreException,
 BadAttributeValueExpException, BadBinaryOpValueExpException, BadLocationException, BadStringOperationException,
 BrokenBarrierException, CertificateException, ClassNotFoundException, CloneNotSupportedException, DataFormatException,
 DatatypeConfigurationException, DestroyFailedException, ExecutionException, ExpandVetoException, FontFormatException,
  GeneralSecurityException, GSSException, IllegalAccessException, IllegalClassFormatException, InstantiationException,
  InterruptedException, IntrospectionException, InvalidApplicationException, InvalidMidiDataException,
  InvalidPreferencesFormatException, InvalidTargetObjectTypeException, InvocationTargetException,
  IOException, JAXBException, JMException, KeySelectorException, LastOwnerException, LineUnavailableException,
   MarshalException, MidiUnavailableException, MimeTypeParseException, MimeTypeParseException, NamingException,
   NoninvertibleTransformException, NoSuchFieldException, NoSuchMethodException, NotBoundException, NotOwnerException,
    ParseException, ParserConfigurationException, PrinterException, PrintException, PrivilegedActionException,
    PropertyVetoException, RefreshFailedException, RemarshalException,RuntimeException, SAXException, ScriptException,
     ServerNotActiveException, SOAPException, SQLException, TimeoutException, TooManyListenersException, TransformerException,
  TransformException, UnmodifiableClassException, UnsupportedAudioFileException, UnsupportedCallbackException, UnsupportedFlavorException,
  UnsupportedLookAndFeelException, URIReferenceException, URISyntaxException,
  UserException, XAException, XMLParseException, XMLSignatureException, XMLStreamException, XPathException

## Throwable类
- Throwable 类有两个属性：detailMassage和cause
  - detailMassage表示具体的错误信息；
  - cause表示Throwable对象；
- 写入Throwable的顺序：fillInStackTrace()->fillInStackTrace(0);
  - 记录栈的深度StackTraceDepth；
  - 记录StackTraceElement[]数组，按照从上到下记录栈的错误信息；
  - getLocalizedMessage() 和getMessage()获取具体的错误信息；
  - getCause()方法表示获取Throwable对象；
  - printStackTrace()层层打印异常栈信息；
  - addSuppressed()可以隐藏异常，try catch没有办法捕获到；
  - logger.error 打印e时，会打印e的异常栈信息；

